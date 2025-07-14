
import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { getRoleConfig } from '@/utils/roleManagement';
import { DashboardTabSection } from './DashboardTabSections';

interface RoleBasedTabFilterProps {
  sections: DashboardTabSection[];
  organizationId: string;
  children: (filteredSections: DashboardTabSection[]) => React.ReactNode;
}

export const RoleBasedTabFilter: React.FC<RoleBasedTabFilterProps> = ({
  sections,
  organizationId,
  children
}) => {
  const { userRole, hasPermission, isAdmin } = useRBAC(organizationId);

  const filteredSections = React.useMemo(() => {
    if (isAdmin) {
      // System admins can see all tabs
      return sections;
    }

    if (!userRole) {
      return [];
    }

    const userRoleConfig = getRoleConfig(userRole);
    
    return sections.map(section => ({
      ...section,
      tabs: section.tabs.filter(tab => {
        // Check permission-based access
        if (tab.requiredPermission && !hasPermission(tab.requiredPermission)) {
          return false;
        }

        // Check role level-based access
        if (tab.minRoleLevel && userRoleConfig.level < tab.minRoleLevel) {
          return false;
        }

        return true;
      })
    })).filter(section => section.tabs.length > 0); // Remove empty sections
  }, [sections, userRole, hasPermission, isAdmin]);

  console.log('RoleBasedTabFilter:', {
    userRole,
    userRoleLevel: userRole ? getRoleConfig(userRole).level : 0,
    originalSections: sections.length,
    filteredSections: filteredSections.length,
    isAdmin
  });

  return <>{children(filteredSections)}</>;
};
