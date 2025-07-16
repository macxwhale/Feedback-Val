
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedDashboardLayout } from './dashboard/EnhancedDashboardLayout';
import { DashboardTabs } from './dashboard/DashboardTabs';
import { FloatingActionButton, ScrollToTopFAB } from '@/components/ui/floating-action-button';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { Plus } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { DashboardDataProvider, useDashboardData } from './dashboard/DashboardDataProvider';

const DashboardContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile } = useResponsiveDesign();
  
  console.log('DashboardContent rendering with slug:', slug);

  const { createDebouncedFunction } = usePerformanceOptimization({
    enableMemoryCleanup: true,
    debounceDelay: 250
  });

  const debouncedSetActiveTab = createDebouncedFunction(setActiveTab);

  let organization, stats, isLoading;
  
  try {
    const dashboardData = useDashboardData();
    organization = dashboardData.organization;
    stats = dashboardData.stats;
    isLoading = dashboardData.isLoading;
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    organization = null;
    stats = null;
    isLoading = false;
  }

  if (!organization && !isLoading) {
    console.log('No organization found and not loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Organization Not Found</h2>
          <p className="text-gray-600">The requested organization could not be found.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      title="Dashboard Error"
      description="There was an error loading the dashboard. Please try refreshing the page."
    >
      <EnhancedDashboardLayout
        organizationName={organization?.name || 'Organization'}
        organizationId={organization?.id || ''}
        organizationSlug={slug || ''}
        activeTab={activeTab}
        onTabChange={debouncedSetActiveTab}
        stats={stats}
        isLoading={isLoading}
      >
        <DashboardTabs 
          activeTab={activeTab}
          organization={organization}
          onTabChange={debouncedSetActiveTab}
        />
      </EnhancedDashboardLayout>
      
      {isMobile && activeTab === 'overview' && (
        <FloatingActionButton
          onClick={() => debouncedSetActiveTab('members')}
          extended
        >
          <Plus className="w-5 h-5" />
          Quick Action
        </FloatingActionButton>
      )}
      
      <ScrollToTopFAB />
    </ErrorBoundary>
  );
};

export const OrganizationAdminDashboard: React.FC = () => {
  console.log('OrganizationAdminDashboard component mounted');
  
  return (
    <ErrorBoundary
      title="Dashboard Error"
      description="There was an error initializing the dashboard."
    >
      <DashboardDataProvider>
        <DashboardContent />
      </DashboardDataProvider>
    </ErrorBoundary>
  );
};
