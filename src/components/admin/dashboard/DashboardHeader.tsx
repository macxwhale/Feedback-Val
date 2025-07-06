
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import { Bell, User, Menu } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/context/OrganizationContext';
import { cn } from '@/lib/utils';

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
    <div className="flex items-center justify-between h-16 px-4 md:px-6 bg-surface border-b border-outline-variant elevation-1">
      {/* Left section with sidebar trigger and breadcrumb */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="p-2 hover:bg-surface-container rounded-full transition-colors">
          <Menu className="w-5 h-5 text-on-surface-variant" />
        </SidebarTrigger>
        <DashboardBreadcrumb 
          organizationName={organizationName}
          currentPage={currentPage}
        />
      </div>

      {/* Center section with organization name - Material Design style */}
      <div className="flex-1 flex justify-center max-w-md">
        <div className="text-center">
          <h1 className="text-title-large text-on-surface font-medium truncate">
            {organization?.name || organizationName}
          </h1>
          <p className="text-body-small text-on-surface-variant">
            Organization Console
          </p>
        </div>
      </div>

      {/* Right section with notifications and user menu */}
      <div className="flex items-center space-x-2">
        {/* Notifications - Material Design style */}
        <div className="relative">
          <NotificationDropdown organizationId={organizationId} />
        </div>

        {/* User menu - Material Design style */}
        <div className="flex items-center space-x-3 pl-3 border-l border-outline-variant">
          <div className="flex items-center space-x-3 px-3 py-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors cursor-pointer group">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block min-w-0">
              <p className="text-label-medium text-on-surface font-medium truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-body-small text-on-surface-variant">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
