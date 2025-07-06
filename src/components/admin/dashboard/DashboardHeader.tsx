
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedNavigationBreadcrumb } from './EnhancedNavigationBreadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Search, Plus, Settings, Download, Command } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/context/OrganizationContext';
import { ContextualActionMenu, createDashboardActions } from './ContextualActionMenu';

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
          { label: 'Quick Add', icon: Plus, variant: 'default' as const, onClick: () => console.log('Quick add') },
          { label: 'Export', icon: Download, variant: 'outline' as const, onClick: () => console.log('Export') }
        ];
      case 'members':
        return [
          { label: 'Invite Members', icon: Plus, variant: 'default' as const, onClick: () => console.log('Invite') }
        ];
      case 'feedback':
        return [
          { label: 'Export Feedback', icon: Download, variant: 'outline' as const, onClick: () => console.log('Export feedback') }
        ];
      default:
        return [];
    }
  };

  const pageActions = getPageActions();
  const dashboardActions = createDashboardActions(
    () => console.log('Refresh dashboard'),
    () => console.log('Open settings')
  );

  return (
    <div className="flex flex-col space-y-4 p-6 bg-gradient-to-r from-white via-orange-50/30 to-amber-50/20 border-b border-gray-100 shadow-sm backdrop-blur-sm">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div className="hidden md:block">
            <EnhancedNavigationBreadcrumb 
              organizationName={organizationName}
              currentPage={currentPage}
              lastUpdated="2 min ago"
              actions={pageActions}
            />
          </div>
        </div>

        {/* Right section with enhanced user controls */}
        <div className="flex items-center space-x-3">
          {/* Global search with keyboard shortcut */}
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:flex items-center space-x-2 min-w-[200px] justify-start text-gray-500 hover:text-gray-700"
          >
            <Search className="w-4 h-4" />
            <span>Search dashboard...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />
              K
            </kbd>
          </Button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

          {/* Notifications with enhanced indicator */}
          <div className="relative">
            <NotificationDropdown organizationId={organizationId} />
          </div>

          {/* Enhanced user menu with contextual actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Administrator
                  </div>
                </div>
              </div>
              <ContextualActionMenu 
                actions={dashboardActions}
                title="Dashboard Settings"
                buttonVariant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile breadcrumb */}
      <div className="md:hidden">
        <EnhancedNavigationBreadcrumb 
          organizationName={organizationName}
          currentPage={currentPage}
          lastUpdated="2 min ago"
          actions={pageActions}
        />
      </div>

      {/* Organization Status Bar */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {organization?.name || organizationName}
            </h2>
            <div className="flex items-center justify-center space-x-3 mt-1">
              <Badge variant="secondary" className="text-xs flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active</span>
              </Badge>
              {currentPage === 'overview' && (
                <Badge variant="outline" className="text-xs">
                  Live monitoring
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
