
import React, { useState } from 'react';
import { UserManagement } from './UserManagement';
import { useEnhancedPermissions } from '@/hooks/useEnhancedPermissions';
import { useAuth } from '@/components/auth/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface EnhancedUserManagementProps {
  organizationId: string;
  organizationName: string;
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  organizationId,
  organizationName
}) => {
  const { user } = useAuth();
  const { canManageUsers, userRole } = useEnhancedPermissions(organizationId);

  // Check if user has permission to manage users
  if (!canManageUsers()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            You don't have permission to manage users in this organization.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your current role: {userRole || 'Unknown'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <UserManagement
      organizationId={organizationId}
      organizationName={organizationName}
    />
  );
};
