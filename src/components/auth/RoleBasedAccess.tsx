
import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { useAuth } from '@/components/auth/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoleConfig } from '@/utils/roleManagement';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  organizationId?: string;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredRole,
  requiredPermission,
  organizationId,
  fallback,
  showAccessDenied = true
}) => {
  const { hasPermission, userRole, isLoading, isAdmin } = useRBAC(organizationId);
  const { isOrgAdmin } = useAuth();

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
      
      return (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Lock className="w-5 h-5 mr-2" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">
                You need {requiredRoleConfig.label} level access or higher.
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Required role:</span>
                <Badge variant={requiredRoleConfig.variant} className="flex items-center gap-1">
                  <requiredRoleConfig.icon className="w-3 h-3" />
                  {requiredRoleConfig.label}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Your role:</span>
                <Badge variant={userRoleConfig.variant} className="flex items-center gap-1">
                  <userRoleConfig.icon className="w-3 h-3" />
                  {userRoleConfig.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('Access denied - insufficient permissions');
    
    if (fallback) return <>{fallback}</>;
    
    if (!showAccessDenied) return null;
    
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Lock className="w-5 h-5 mr-2" />
            Permission Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600">
              You don't have the required permission: {requiredPermission}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('Access granted');
  return <>{children}</>;
};
