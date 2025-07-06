
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import { Bell, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/context/OrganizationContext';

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
  const { user } = useAuth();
  const { organization } = useOrganization();

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Left section with sidebar trigger and breadcrumb */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <DashboardBreadcrumb 
          organizationName={organizationName}
          currentPage={currentPage}
        />
      </div>

      {/* Center section with organization name */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {organization?.name || organizationName}
        </h2>
      </div>

      {/* Right section with notifications and user menu */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <NotificationDropdown organizationId={organizationId} />

        {/* User menu */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
