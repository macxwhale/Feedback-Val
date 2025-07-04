
import React from 'react';
import { DashboardDataProvider } from './dashboard/DashboardDataProvider';
import { ModernOrganizationDashboard } from './dashboard/ModernOrganizationDashboard';

export const OrganizationAdminDashboard: React.FC = () => {
  return (
    <DashboardDataProvider>
      <ModernOrganizationDashboard />
    </DashboardDataProvider>
  );
};
