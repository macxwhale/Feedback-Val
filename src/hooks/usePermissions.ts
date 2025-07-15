
import { useRBAC } from './useRBAC';
import { useAuth } from '@/components/auth/AuthWrapper';

interface UsePermissionsProps {
  organizationId?: string;
}

export const usePermissions = ({ organizationId }: UsePermissionsProps = {}) => {
  const { hasPermission, userRole, isLoading, isAdmin: isSystemAdmin } = useRBAC(organizationId);
  const { isAdmin } = useAuth();

  const checkPermission = (permission: string): boolean => {
    // System admin has all permissions
    if (isSystemAdmin || isAdmin) return true;
    
    // Owner and admin roles have broad permissions
    if (userRole && ['owner', 'admin'].includes(userRole)) return true;
    
    // Check specific permission using enhanced role
    return hasPermission(permission);
  };

  const checkRole = (requiredRole: string): boolean => {
    // System admin bypasses role checks
    if (isSystemAdmin || isAdmin) return true;
    
    // Owner and admin roles have broad access
    if (userRole && ['owner', 'admin'].includes(userRole)) return true;
    
    // Check specific enhanced role
    return userRole === requiredRole;
  };

  return {
    hasPermission: checkPermission,
    hasRole: checkRole,
    userRole,
    isLoading,
    isSystemAdmin: isSystemAdmin || isAdmin,
    isOrgAdmin: userRole && ['owner', 'admin'].includes(userRole)
  };
};
