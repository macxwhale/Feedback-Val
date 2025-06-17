
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EnhancedLoadingSpinner } from './dashboard/EnhancedLoadingSpinner';
import { formatDate } from '@/utils/userManagementUtils';

interface AuditLogEntry {
  id: string;
  action: string;
  resource_type: string;
  severity: string;
  created_at: string;
  metadata: any;
  user_id: string;
  organization_id?: string;
}

export const AuditLogViewer: React.FC = () => {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log_enhanced')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    staleTime: 30000,
  });

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  if (isLoading) {
    return <EnhancedLoadingSpinner text="Loading audit logs..." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        {auditLogs && auditLogs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.created_at)}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.resource_type}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.user_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <details className="cursor-pointer">
                        <summary className="text-sm text-blue-600 hover:text-blue-800">
                          View Details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-w-md">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">No audit logs found</p>
        )}
      </CardContent>
    </Card>
  );
};
