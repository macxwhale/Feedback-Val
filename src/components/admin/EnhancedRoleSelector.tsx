
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRoleConfig, getAvailableRoles, type Role } from '@/utils/roleManagement';

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
  // Normalize roles - ensure we're working with valid enhanced roles
  const normalizedCurrentRole = currentUserRole || 'member';
  const normalizedSelectedRole = selectedRole || 'member';
  
  const availableRoles = getAvailableRoles(normalizedCurrentRole);
  
  // Add current selected role if it exists and is valid (for editing scenarios)
  const allRoles = [...availableRoles];
  if (normalizedSelectedRole && 
      normalizedSelectedRole !== 'admin' && // Exclude legacy 'admin' role
      !availableRoles.includes(normalizedSelectedRole as Role) && 
      ['owner', 'admin', 'manager', 'analyst', 'member', 'viewer'].includes(normalizedSelectedRole)) {
    allRoles.push(normalizedSelectedRole as Role);
  }

  // Remove duplicates and filter out invalid roles
  const uniqueValidRoles = [...new Set(allRoles)].filter(role => 
    ['owner', 'admin', 'manager', 'analyst', 'member', 'viewer'].includes(role)
  );

  return (
    <Select value={normalizedSelectedRole} onValueChange={onRoleChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent className="bg-white z-50">
        {uniqueValidRoles.map((role) => {
          const config = getRoleConfig(role);
          return (
            <SelectItem key={role} value={role} className="hover:bg-gray-100">
              <div className="flex items-center gap-2">
                <config.icon className="w-4 h-4" />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
