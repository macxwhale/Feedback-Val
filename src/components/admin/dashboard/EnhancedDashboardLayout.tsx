
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { DashboardHeader } from './DashboardHeader';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { cn } from '@/lib/utils';

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
  organizationName: string;
  organizationId: string;
  organizationSlug: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: any;
  isLoading?: boolean;
}

export const EnhancedDashboardLayout: React.FC<EnhancedDashboardLayoutProps> = ({
  children,
  organizationName,
  organizationId,
  organizationSlug,
  activeTab,
  onTabChange,
  stats,
  isLoading = false
}) => {
  const { isMobile, isTablet } = useResponsiveDesign();

  const navigationItems = [
    { id: 'overview', label: 'Analytics', icon: 'BarChart3', path: '', badge: stats?.growth_rate > 0 ? `+${stats.growth_rate}%` : undefined },
    { id: 'members', label: 'Members', icon: 'Users', path: '/members', badge: stats?.active_members },
    { id: 'feedback', label: 'Feedback', icon: 'MessageSquare', path: '/feedback', badge: stats?.total_responses },
    { id: 'questions', label: 'Questions', icon: 'MessageSquare', path: '/questions', badge: stats?.total_questions },
    { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' }
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <DashboardHeader
          organizationName={organizationName}
          organizationId={organizationId}
          currentPage={activeTab}
          onNavigate={() => {}}
        />
        <main className="px-4 py-8 max-w-7xl mx-auto">
          <div className="space-y-8">
            {children}
          </div>
        </main>
        <BottomNavigation
          items={navigationItems.map(item => ({
            ...item,
            icon: require('lucide-react')[item.icon],
            path: item.path
          }))}
          organizationSlug={organizationSlug}
        />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isTablet}>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar
          organizationName={organizationName}
          activeTab={activeTab}
          onTabChange={onTabChange}
          stats={stats}
          isLoading={isLoading}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            organizationName={organizationName}
            organizationId={organizationId}
            currentPage={activeTab}
            onNavigate={() => {}}
          />
          
          <main className={cn(
            'flex-1 overflow-auto bg-gray-50 dark:bg-gray-900',
            'px-8 py-8 lg:px-12',
            isTablet && 'px-6 py-6'
          )}>
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
