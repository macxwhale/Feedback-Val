
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { DashboardHeader } from './DashboardHeader';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { AccessibilityWrapper } from '@/components/ui/accessibility-wrapper';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { MobileNavigation } from '@/components/ui/mobile-navigation';
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
  const { isMobile, isTablet, screenWidth } = useResponsiveDesign();

  const navigationItems = [
    { id: 'overview', label: 'Analytics', icon: 'BarChart3', path: '', badge: stats?.growth_rate > 0 ? `+${stats.growth_rate}%` : undefined },
    { id: 'members', label: 'Members', icon: 'Users', path: '/members', badge: stats?.active_members },
    { id: 'feedback', label: 'Feedback', icon: 'MessageSquare', path: '/feedback', badge: stats?.total_responses },
    { id: 'questions', label: 'Questions', icon: 'MessageSquare', path: '/questions', badge: stats?.total_questions },
    { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' }
  ];

  // Mobile Layout
  if (isMobile) {
    return (
      <AccessibilityWrapper announceChanges landmarks skipLink="#main-content">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
          <DashboardHeader
            organizationName={organizationName}
            organizationId={organizationId}
            currentPage={activeTab}
            onNavigate={() => {}}
          />
          
          <ResponsiveContainer maxWidth="full" padding="sm">
            <main id="main-content" className="py-4">
              {children}
            </main>
          </ResponsiveContainer>
          
          <BottomNavigation
            items={navigationItems.map(item => ({
              ...item,
              icon: require('lucide-react')[item.icon],
              path: item.path
            }))}
            organizationSlug={organizationSlug}
          />
        </div>
      </AccessibilityWrapper>
    );
  }

  // Desktop/Tablet Layout
  return (
    <AccessibilityWrapper announceChanges landmarks skipLink="#main-content">
      <SidebarProvider defaultOpen={!isTablet}>
        <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-900">
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
            
            <main 
              id="main-content"
              className={cn(
                'flex-1 overflow-auto bg-white dark:bg-slate-900',
                isTablet ? 'p-4' : 'p-8'
              )}
            >
              <ResponsiveContainer maxWidth="full" className="max-w-7xl">
                {children}
              </ResponsiveContainer>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AccessibilityWrapper>
  );
};
