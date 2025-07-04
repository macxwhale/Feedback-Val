
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getEnhancedRoleBadge, getAvailableRolesForUser, type EnhancedRole } from '@/utils/enhancedRoleUtils';

interface EnhancedRoleSelectorProps {
  currentUserRole: string;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

export const EnhancedRoleSelector: React.FC<EnhancedRoleSelectorProps> = ({
  currentUserRole,
  selectedRole,
  onRoleChange,
  disabled = false
}) => {
  const availableRoles = getAvailableRolesForUser(currentUserRole);

  return (
    <Select value={selectedRole} onValueChange={onRoleChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2">
            {(() => {
              const { icon: Icon, label } = getEnhancedRoleBadge(selectedRole);
              return (
                <>
                  <Icon className="w-4 h-4" />
                  {label}
                </>
              );
            })()}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableRoles.map((role) => {
          const { icon: Icon, label, description, variant } = getEnhancedRoleBadge(role);
          return (
            <SelectItem key={role} value={role}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
                <Badge variant={variant} className="text-xs">
                  {label}
                </Badge>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
