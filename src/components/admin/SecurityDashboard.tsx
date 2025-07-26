
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Search, Filter } from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string;
  organization_id: string;
  ip_address: string;
  user_agent: string;
  event_data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const SecurityDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  // Mock data since security_events table was removed
  const securityEvents: SecurityEvent[] = [];
  const isLoading = false;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'failed_login': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'successful_login': return <Shield className="h-4 w-4 text-green-500" />;
      case 'permission_denied': return <Eye className="h-4 w-4 text-orange-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const criticalEvents = securityEvents?.filter(event => event.severity === 'critical') || [];
  const highEvents = securityEvents?.filter(event => event.severity === 'high') || [];
  const recentFailedLogins = securityEvents?.filter(event => event.event_type === 'failed_login').slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze security events</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Notice about disabled security monitoring */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700">
          Security monitoring is currently disabled. No security events are being tracked.
        </AlertDescription>
      </Alert>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Security Events
          </CardTitle>
          <CardDescription>Security monitoring is currently disabled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                disabled
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter} disabled>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter} disabled>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="failed_login">Failed Login</SelectItem>
                <SelectItem value="successful_login">Successful Login</SelectItem>
                <SelectItem value="permission_denied">Permission Denied</SelectItem>
                <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Security monitoring is disabled - no events to display
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
