
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getRoleConfig } from '@/utils/roleManagement';

interface EnhancedRoleBadgeProps {
  role: string;
  showIcon?: boolean;
  className?: string;
}

export const EnhancedRoleBadge: React.FC<EnhancedRoleBadgeProps> = ({ 
  role, 
  showIcon = false, 
  className = '' 
}) => {
  // Normalize role - handle null/undefined/invalid roles
  const normalizedRole = role && ['owner', 'admin', 'manager', 'analyst', 'member', 'viewer'].includes(role) 
    ? role 
    : 'member';
    
  const config = getRoleConfig(normalizedRole);
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className={className}>
      {showIcon && <IconComponent className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};
