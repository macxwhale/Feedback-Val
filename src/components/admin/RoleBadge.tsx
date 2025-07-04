
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getRoleBadge } from '@/utils/userManagementUtils';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const { variant, icon: Icon, label } = getRoleBadge(role);

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};
