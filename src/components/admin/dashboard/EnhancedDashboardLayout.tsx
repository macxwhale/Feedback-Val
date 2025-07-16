
import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { tabSections } from './DashboardTabSections';
import { RoleBasedTabFilter } from './RoleBasedTabFilter';

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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        organizationName={organizationName}
        organizationId={organizationId}
        currentPage={activeTab}
        onNavigate={handleNavigate}
      />
      
      <div className="flex">
        <DashboardSidebar
          organizationName={organizationName}
          activeTab={activeTab}
          onTabChange={onTabChange}
          stats={stats}
          isLoading={isLoading}
        />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
