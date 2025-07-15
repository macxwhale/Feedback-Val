
import { useRBAC } from './useRBAC';
import { useAuth } from '@/components/auth/AuthWrapper';

interface UsePermissionsProps {
  organizationId?: string;
}

export const usePermissions = ({ organizationId }: UsePermissionsProps = {}) => {
  const { hasPermission, userRole, isLoading, isAdmin: isSystemAdmin } = useRBAC(organizationId);
  const { isOrgAdmin, isAdmin } = useAuth();

  const checkPermission = (permission: string): boolean => {
    // System admin has all permissions
    if (isSystemAdmin || isAdmin) return true;
    
    // Org admin has org-level permissions
    if (isOrgAdmin && organizationId) return true;
    
    // Check specific permission
    return hasPermission(permission);
  };

  const checkRole = (requiredRole: string): boolean => {
    // System admin bypasses role checks
    if (isSystemAdmin || isAdmin) return true;
    
    // Org admin bypasses most role checks
    if (isOrgAdmin && organizationId) return true;
    
    // TODO: Implement proper role hierarchy checking
    return userRole === requiredRole;
  };

  return {
    hasPermission: checkPermission,
    hasRole: checkRole,
    userRole,
    isLoading,
    isSystemAdmin: isSystemAdmin || isAdmin,
    isOrgAdmin
  };
};
