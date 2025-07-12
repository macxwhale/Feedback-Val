
import React from "react";
import { EnhancedUserManagement } from '@/components/admin/EnhancedUserManagement';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

interface UserManagementTabProps {
  organization: any;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ organization }) => (
  <PermissionGuard 
    permission="manage_users" 
    organizationId={organization.id}
    showRequiredRole={true}
    fallback={
      <div className="text-center p-8">
        <p className="text-gray-500">You need manager-level access or higher to manage users.</p>
        <p className="text-sm text-gray-400 mt-2">
          Contact your organization administrator for access.
        </p>
      </div>
    }
  >
    <EnhancedUserManagement
      organizationId={organization.id}
      organizationName={organization.name}
    />
  </PermissionGuard>
);

export default UserManagementTab;
