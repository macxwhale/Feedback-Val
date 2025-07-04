
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { cn } from '@/lib/utils';

interface EnhancedDashboardLayoutProps {
  organizationName: string;
  organizationId: string;
  organizationSlug: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: any;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const EnhancedDashboardLayout: React.FC<EnhancedDashboardLayoutProps> = ({
  organizationName,
  organizationId,
  organizationSlug,
  activeTab,
  onTabChange,
  stats,
  isLoading = false,
  children
}) => {
  const { isMobile } = useMobileDetection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar
            organizationName={organizationName}
            activeTab={activeTab}
            onTabChange={onTabChange}
            stats={stats}
            isLoading={isLoading}
          />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Enhanced Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <DashboardHeader
                organizationName={organizationName}
                organizationId={organizationId}
                activeTab={activeTab}
              />
              <div className="px-6 pb-4">
                <DashboardBreadcrumb
                  organizationName={organizationName}
                  organizationSlug={organizationSlug}
                  activeTab={activeTab}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto px-6 py-6 max-w-7xl">
                <div className={cn(
                  "space-y-6",
                  // Enhanced content styling
                  "animate-fade-in"
                )}>
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};
