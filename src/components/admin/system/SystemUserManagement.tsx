import React, { useState } from 'react';
import { useSystemUserManagementData, useAssignUserToOrg, SystemUser } from '@/hooks/useSystemUsers';
import { SystemUsersTable } from './SystemUsersTable';
import { SystemInvitationsTable } from './SystemInvitationsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedLoadingSpinner } from '@/components/admin/dashboard/EnhancedLoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { AssignUserToOrgModal } from './AssignUserToOrgModal';
import { Organization } from '@/services/organizationService.types';
import { toast } from 'sonner';

interface SystemUserManagementProps {
  organizations: Organization[];
}

export const SystemUserManagement: React.FC<SystemUserManagementProps> = ({ organizations }) => {
  const { data, isLoading, error } = useSystemUserManagementData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  const assignUserMutation = useAssignUserToOrg();

  const handleOpenModal = (user: SystemUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleAssignUser = (userId: string, email: string, organizationId: string, role: string) => {
    assignUserMutation.mutate(
      { userId, email, organizationId, role },
      {
        onSuccess: () => {
          toast.success(`User ${email} assigned successfully.`);
          handleCloseModal();
        },
        onError: (error: any) => {
          toast.error(`Failed to assign user: ${error.message}`);
        },
      }
    );
  };

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
          <CardDescription>A list of all users across all organizations. You can assign existing users to new organizations from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemUsersTable users={data?.users || []} onAssignUser={handleOpenModal} />
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

      <AssignUserToOrgModal
        isOpen={isModalOpen}
        user={selectedUser}
        organizations={organizations}
        onClose={handleCloseModal}
        onSubmit={handleAssignUser}
        isSubmitting={assignUserMutation.isPending}
      />
    </div>
  );
};
