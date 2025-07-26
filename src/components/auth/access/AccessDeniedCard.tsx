
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock, Mail } from 'lucide-react';
import { getRoleConfig } from '@/utils/roleManagement';
import { useOrganization } from '@/context/OrganizationContext';

interface AccessDeniedCardProps {
  type: 'role' | 'permission';
  requiredRole?: string;
  requiredPermission?: string;
  userRole?: string;
  onRequestAccess: () => void;
  isSubmitting?: boolean;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  type,
  requiredRole,
  requiredPermission,
  userRole,
  onRequestAccess,
  isSubmitting = false
}) => {
  const { organization } = useOrganization();

  const renderRoleBasedDenial = () => {
    if (!requiredRole || !userRole) return null;

    const requiredRoleConfig = getRoleConfig(requiredRole);
    const userRoleConfig = getRoleConfig(userRole);
    const RequiredIcon = requiredRoleConfig.icon;
    const UserIcon = userRoleConfig.icon;

    return (
      <>
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
              <RequiredIcon className="w-3 h-3" />
              {requiredRoleConfig.label}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Your role:</span>
            <Badge variant={userRoleConfig.variant} className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              {userRoleConfig.label}
            </Badge>
          </div>
        </div>
      </>
    );
  };

  const renderPermissionBasedDenial = () => {
    if (!requiredPermission || !userRole) return null;

    const UserIcon = getRoleConfig(userRole).icon;

    return (
      <>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-600">
            You don't have the required permission: {requiredPermission}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Your role:</span>
          <Badge variant={getRoleConfig(userRole).variant} className="flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            {getRoleConfig(userRole).label}
          </Badge>
        </div>
      </>
    );
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <Lock className="w-5 h-5 mr-2" />
          {type === 'role' ? 'Access Restricted' : 'Permission Required'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'role' ? renderRoleBasedDenial() : renderPermissionBasedDenial()}
        
        {organization && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Organization:</span> {organization.name}
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={onRequestAccess} 
            size="sm" 
            className="w-full"
            disabled={isSubmitting}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Requesting...' : type === 'role' ? 'Request Role Upgrade' : 'Request Access'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Contact your organization administrator for assistance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
