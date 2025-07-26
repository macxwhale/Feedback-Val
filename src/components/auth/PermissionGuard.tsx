
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { AccessDeniedCard } from './access/AccessDeniedCard';
import { useAccessRequest } from './access/useAccessRequest';
import { Loader2 } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  organizationId?: string;
  fallback?: React.ReactNode;
  showRequiredRole?: boolean;
  onRequestAccess?: () => void;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  role,
  organizationId,
  fallback,
  showRequiredRole = false,
  onRequestAccess
}) => {
  const { hasPermission, hasRole, userRole, isLoading } = usePermissions({ organizationId });
  const { submitAccessRequest, isSubmitting } = useAccessRequest();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Checking permissions...</span>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (permission && !hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    
    if (!showRequiredRole) return null;

    const handleRequestAccess = async () => {
      if (onRequestAccess) {
        onRequestAccess();
      } else {
        await submitAccessRequest({
          requestType: 'permission',
          requestedPermission: permission,
          reason: `Need ${permission} permission to access this feature`
        });
      }
    };

    return (
      <AccessDeniedCard
        type="permission"
        requiredPermission={permission}
        userRole={userRole}
        onRequestAccess={handleRequestAccess}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Check role-based access
  if (role && !hasRole(role)) {
    if (fallback) return <>{fallback}</>;
    
    if (!showRequiredRole) return null;

    const handleRequestAccess = async () => {
      if (onRequestAccess) {
        onRequestAccess();
      } else {
        await submitAccessRequest({
          requestType: 'role_upgrade',
          requestedRole: role,
          reason: `Need ${role} level access for this feature`
        });
      }
    };

    return (
      <AccessDeniedCard
        type="role"
        requiredRole={role}
        userRole={userRole}
        onRequestAccess={handleRequestAccess}
        isSubmitting={isSubmitting}
      />
    );
  }

  return <>{children}</>;
};
