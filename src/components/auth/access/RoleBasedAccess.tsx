
import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { useAuth } from '@/components/auth/AuthWrapper';
import { Loader2 } from 'lucide-react';
import { getRoleConfig } from '@/utils/roleManagement';
import { AccessDeniedCard } from './AccessDeniedCard';
import { useAccessRequest } from './useAccessRequest';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  organizationId?: string;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
  onRequestAccess?: () => void;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredRole,
  requiredPermission,
  organizationId,
  fallback,
  showAccessDenied = true,
  onRequestAccess
}) => {
  const { hasPermission, userRole, isLoading, isAdmin } = useRBAC(organizationId);
  const { isOrgAdmin } = useAuth();
  const { submitAccessRequest, isSubmitting } = useAccessRequest();

  console.log('RoleBasedAccess check:', {
    requiredRole,
    requiredPermission,
    userRole,
    isAdmin,
    isOrgAdmin,
    isLoading,
    organizationId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Checking access...</span>
        </div>
      </div>
    );
  }

  // Admin bypass - both system admin and org admin should have access
  if (isAdmin || isOrgAdmin) {
    console.log('Access granted via admin privileges');
    return <>{children}</>;
  }

  // Check role-based access
  if (requiredRole && userRole) {
    const userRoleConfig = getRoleConfig(userRole);
    const requiredRoleConfig = getRoleConfig(requiredRole);
    
    if (userRoleConfig.level < requiredRoleConfig.level) {
      console.log('Access denied - insufficient role level');
      
      if (fallback) return <>{fallback}</>;
      if (!showAccessDenied) return null;
      
      const handleRequestAccess = async () => {
        if (onRequestAccess) {
          onRequestAccess();
        } else {
          await submitAccessRequest({
            requestType: 'role_upgrade',
            requestedRole: requiredRole,
            reason: `Need ${requiredRole} level access for this feature`
          });
        }
      };
      
      return (
        <AccessDeniedCard
          type="role"
          requiredRole={requiredRole}
          userRole={userRole}
          onRequestAccess={handleRequestAccess}
          isSubmitting={isSubmitting}
        />
      );
    }
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('Access denied - insufficient permissions');
    
    if (fallback) return <>{fallback}</>;
    if (!showAccessDenied) return null;
    
    const handleRequestAccess = async () => {
      if (onRequestAccess) {
        onRequestAccess();
      } else {
        await submitAccessRequest({
          requestType: 'permission',
          requestedPermission: requiredPermission,
          reason: `Need ${requiredPermission} permission to access this feature`
        });
      }
    };

    return (
      <AccessDeniedCard
        type="permission"
        requiredPermission={requiredPermission}
        userRole={userRole}
        onRequestAccess={handleRequestAccess}
        isSubmitting={isSubmitting}
      />
    );
  }

  console.log('Access granted');
  return <>{children}</>;
};
