
import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardStats } from './DashboardStats';
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
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        organizationName={organizationName}
        organizationSlug={organizationSlug}
      />
      
      <div className="flex">
        <RoleBasedTabFilter 
          sections={tabSections} 
          organizationId={organizationId}
        >
          {(filteredSections) => (
            <DashboardSidebar
              sections={filteredSections}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          )}
        </RoleBasedTabFilter>
        
        <main className="flex-1 p-6">
          {stats && !isLoading && (
            <div className="mb-6">
              <DashboardStats stats={stats} />
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};
