
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DashboardSearch } from './DashboardSearch';
import { NotificationDropdown } from './NotificationDropdown';

interface DashboardHeaderProps {
  organizationName: string;
  organizationId: string;
  currentPage: string;
  onNavigate: (url: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  organizationName,
  organizationId,
  currentPage,
  onNavigate
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <DashboardBreadcrumb 
            organizationName={organizationName}
            currentPage={currentPage}
          />
        </div>
        <div className="flex items-center space-x-4">
          <NotificationDropdown organizationId={organizationId} />
          <DashboardSearch 
            organizationId={organizationId}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
