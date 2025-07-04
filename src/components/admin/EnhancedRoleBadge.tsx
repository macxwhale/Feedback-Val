
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getEnhancedRoleBadge } from '@/utils/enhancedRoleUtils';

interface EnhancedRoleBadgeProps {
  role: string;
  showDescription?: boolean;
}

export const EnhancedRoleBadge: React.FC<EnhancedRoleBadgeProps> = ({ 
  role, 
  showDescription = false 
}) => {
  const { variant, icon: Icon, label, description } = getEnhancedRoleBadge(role);

  return (
    <div className="flex flex-col gap-1">
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
      {showDescription && (
        <span className="text-xs text-gray-500">{description}</span>
      )}
    </div>
  );
};
