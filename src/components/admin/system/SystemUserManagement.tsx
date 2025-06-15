
import React from 'react';
import { useSystemUserManagementData } from '@/hooks/useSystemUsers';
import { SystemUsersTable } from './SystemUsersTable';
import { SystemInvitationsTable } from './SystemInvitationsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedLoadingSpinner } from '@/components/admin/dashboard/EnhancedLoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const SystemUserManagement: React.FC = () => {
  const { data, isLoading, error } = useSystemUserManagementData();

  if (isLoading) {
    return <EnhancedLoadingSpinner text="Loading system-wide user data..." />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Fetching Data</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Organization Users</CardTitle>
          <CardDescription>A list of all users across all organizations.</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemUsersTable users={data?.users || []} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Pending Invitations</CardTitle>
          <CardDescription>A list of all pending invitations across all organizations.</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemInvitationsTable invitations={data?.invitations || []} />
        </CardContent>
      </Card>
    </div>
  );
};
