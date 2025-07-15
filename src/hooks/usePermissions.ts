
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
    
    // Org admin has org-level permissions (but check enhanced role first)
    if (userRole && ['owner', 'admin'].includes(userRole)) return true;
    
    // Fallback to legacy org admin check
    if (isOrgAdmin && organizationId) return true;
    
    // Check specific permission using enhanced role
    return hasPermission(permission);
  };

  const checkRole = (requiredRole: string): boolean => {
    // System admin bypasses role checks
    if (isSystemAdmin || isAdmin) return true;
    
    // Enhanced role check
    if (userRole && ['owner', 'admin'].includes(userRole)) return true;
    
    // Legacy org admin check
    if (isOrgAdmin && organizationId) return true;
    
    // Check specific enhanced role
    return userRole === requiredRole;
  };

  return {
    hasPermission: checkPermission,
    hasRole: checkRole,
    userRole,
    isLoading,
    isSystemAdmin: isSystemAdmin || isAdmin,
    isOrgAdmin: isOrgAdmin || (userRole && ['owner', 'admin'].includes(userRole))
  };
};
