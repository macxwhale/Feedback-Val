
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UserManagementHeaderProps {
  organizationName: string;
  onInviteUser: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  organizationName,
  onInviteUser
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Enhanced User Management</h2>
        <p className="text-gray-600">Manage members for {organizationName}</p>
      </div>
      <Button onClick={onInviteUser}>
        <UserPlus className="w-4 h-4 mr-2" />
        Invite User
      </Button>
    </div>
  );
};
