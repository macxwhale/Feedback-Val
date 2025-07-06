
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Search, Plus, Settings, Download } from 'lucide-react';
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

  const getPageActions = () => {
    switch (currentPage) {
      case 'overview':
        return [
          { icon: Plus, label: 'Quick Add', variant: 'default' as const },
          { icon: Download, label: 'Export', variant: 'outline' as const }
        ];
      case 'members':
        return [
          { icon: Plus, label: 'Invite Members', variant: 'default' as const }
        ];
      case 'feedback':
        return [
          { icon: Download, label: 'Export Feedback', variant: 'outline' as const }
        ];
      default:
        return [];
    }
  };

  const pageActions = getPageActions();

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Left section with sidebar trigger and enhanced breadcrumb */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div className="hidden md:block">
          <DashboardBreadcrumb 
            organizationName={organizationName}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Center section with organization info and status */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {organization?.name || organizationName}
            </h2>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Active
              </Badge>
              {currentPage === 'overview' && (
                <Badge variant="outline" className="text-xs">
                  Last updated: 2 min ago
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right section with contextual actions, search, notifications, and user menu */}
      <div className="flex items-center space-x-2">
        {/* Contextual Page Actions */}
        {pageActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            size="sm"
            className="hidden md:flex items-center"
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        ))}

        {/* Search Button */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

        {/* Notifications with enhanced indicator */}
        <div className="relative">
          <NotificationDropdown organizationId={organizationId} />
        </div>

        {/* User menu with enhanced display */}
        <div className="flex items-center space-x-2 pl-2">
          <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  Administrator
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <Settings className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
