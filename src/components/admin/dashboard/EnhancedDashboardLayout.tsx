
import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
  isLoading,
  children
}) => {
  const handleNavigate = (url: string) => {
    console.log('Navigate to:', url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <DashboardSidebar
          organizationName={organizationName}
          activeTab={activeTab}
          onTabChange={onTabChange}
          stats={stats}
          isLoading={isLoading}
        />
        
        <SidebarInset className="flex-1">
          <DashboardHeader 
            organizationName={organizationName}
            organizationId={organizationId}
            currentPage={activeTab}
            onNavigate={handleNavigate}
          />
          
          <main className="p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
