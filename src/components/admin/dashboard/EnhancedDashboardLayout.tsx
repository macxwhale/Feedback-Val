
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { DashboardHeader } from './DashboardHeader';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { ResponsiveLayout, ResponsiveStack } from '@/components/ui/responsive-layout';
import { cn } from '@/lib/utils';
import { BarChart3, Users, MessageSquare, Settings } from 'lucide-react';

// Icon mapping for dynamic icon resolution
const iconMap = {
  BarChart3,
  Users,
  MessageSquare,
  Settings
};

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
  const { 
    isMobile, 
    isTablet, 
    screenWidth, 
    shouldUseCompactLayout,
    prefersReducedMotion,
    currentBreakpoint
  } = useResponsiveDesign();

  // Navigation items with performance tab removed
  const navigationItems = [
    { 
      id: 'overview', 
      label: shouldUseCompactLayout ? 'Analytics' : 'Dashboard Analytics', 
      icon: 'BarChart3', 
      path: '', 
      badge: stats?.growth_rate > 0 ? `+${stats.growth_rate}%` : undefined 
    },
    { 
      id: 'members', 
      label: shouldUseCompactLayout ? 'Members' : 'Team Members', 
      icon: 'Users', 
      path: '/members', 
      badge: stats?.active_members 
    },
    { 
      id: 'feedback', 
      label: shouldUseCompactLayout ? 'Feedback' : 'Customer Feedback', 
      icon: 'MessageSquare', 
      path: '/feedback', 
      badge: stats?.total_responses 
    },
    { 
      id: 'questions', 
      label: shouldUseCompactLayout ? 'Questions' : 'Survey Questions', 
      icon: 'MessageSquare', 
      path: '/questions', 
      badge: stats?.total_questions 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: 'Settings', 
      path: '/settings' 
    }
  ];

  // Mobile Layout with enhanced responsiveness
  if (isMobile) {
    return (
      <ResponsiveLayout
        className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20"
        padding="none"
        maxWidth="full"
        skipLink="#main-content"
        ariaLabel="Dashboard Layout"
      >
        <DashboardHeader
          organizationName={organizationName}
          organizationId={organizationId}
          currentPage={activeTab}
          onNavigate={() => {}}
        />
        
        <main 
          id="main-content" 
          className={cn(
            'transition-all px-4 py-6',
            !prefersReducedMotion && 'duration-300 ease-out'
          )}
        >
          {children}
        </main>
        
        <BottomNavigation
          items={navigationItems.map(item => ({
            ...item,
            icon: iconMap[item.icon as keyof typeof iconMap] || MessageSquare,
            path: item.path
          }))}
          organizationSlug={organizationSlug}
        />
      </ResponsiveLayout>
    );
  }

  // Desktop/Tablet Layout with improved spacing and content area optimization
  return (
    <ResponsiveLayout
      className="min-h-screen"
      padding="none"
      maxWidth="full"
      skipLink="#main-content"
      ariaLabel="Dashboard Layout"
    >
      <SidebarProvider 
        defaultOpen={!isTablet}
        className="w-full"
      >
        <ResponsiveStack 
          direction="horizontal"
          spacing="none"
          align="stretch"
          className="min-h-screen bg-slate-50 dark:bg-slate-900"
        >
          <DashboardSidebar
            organizationName={organizationName}
            activeTab={activeTab}
            onTabChange={onTabChange}
            stats={stats}
            isLoading={isLoading}
          />
          
          <ResponsiveStack 
            direction="vertical"
            spacing="none"
            align="stretch"
            className="flex-1 min-w-0 max-w-none overflow-hidden"
          >
            <DashboardHeader
              organizationName={organizationName}
              organizationId={organizationId}
              currentPage={activeTab}
              onNavigate={() => {}}
            />
            
            <main 
              id="main-content"
              className={cn(
                'flex-1 overflow-auto bg-white dark:bg-slate-900 transition-all',
                'px-6 py-6 max-w-full',
                !prefersReducedMotion && 'duration-300 ease-out'
              )}
            >
              <div className="max-w-7xl mx-auto w-full space-y-6">
                {children}
              </div>
            </main>
          </ResponsiveStack>
        </ResponsiveStack>
      </SidebarProvider>
    </ResponsiveLayout>
  );
};
