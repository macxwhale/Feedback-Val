
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedDashboardLayout } from './dashboard/EnhancedDashboardLayout';
import { FloatingActionButton, ScrollToTopFAB } from '@/components/ui/floating-action-button';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { Plus } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Data Provider
import { DashboardDataProvider, useDashboardData } from './dashboard/DashboardDataProvider';

// Lazy load tab components for better performance
const DashboardOverviewContent = React.lazy(() => 
  import('./dashboard/DashboardOverviewContent').then(module => ({ default: module.DashboardOverviewContent }))
);

const MembersTab = React.lazy(() => 
  import('./dashboard/tabs/MembersTab').then(module => ({ default: module.default }))
);

const FeedbackTab = React.lazy(() => 
  import('./dashboard/tabs/FeedbackTab').then(module => ({ default: module.FeedbackTab }))
);

const QuestionsTab = React.lazy(() => 
  import('./dashboard/tabs/QuestionsTab').then(module => ({ default: module.QuestionsTab }))
);

const SettingsTab = React.lazy(() => 
  import('./dashboard/tabs/SettingsTab').then(module => ({ default: module.SettingsTab }))
);

const IntegrationsTab = React.lazy(() => 
  import('./dashboard/tabs/IntegrationsTab').then(module => ({ default: module.IntegrationsTab }))
);

const SentimentTab = React.lazy(() => 
  import('./dashboard/tabs/SentimentTab').then(module => ({ default: module.SentimentTab }))
);

const PerformanceTab = React.lazy(() => 
  import('./dashboard/tabs/PerformanceTab').then(module => ({ default: module.PerformanceTab }))
);

const CustomerInsightsTab = React.lazy(() => 
  import('./dashboard/tabs/CustomerInsightsTab').then(module => ({ default: module.CustomerInsightsTab }))
);

const DashboardContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile } = useResponsiveDesign();
  const { organization, stats, isLoading } = useDashboardData();
  
  // Performance optimization
  const { createDebouncedFunction } = usePerformanceOptimization({
    enableMemoryCleanup: true,
    debounceDelay: 250
  });

  // Debounce tab changes to prevent rapid switching
  const debouncedSetActiveTab = createDebouncedFunction(setActiveTab);

  const renderTabContent = () => {
    const tabProps = {
      organizationId: organization?.id || '',
      organization
    };

    switch (activeTab) {
      case 'members':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <MembersTab {...tabProps} />
          </React.Suspense>
        );
      case 'feedback':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <FeedbackTab organizationId={tabProps.organizationId} />
          </React.Suspense>
        );
      case 'questions':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <QuestionsTab />
          </React.Suspense>
        );
      case 'settings':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <SettingsTab {...tabProps} />
          </React.Suspense>
        );
      case 'integrations':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <IntegrationsTab />
          </React.Suspense>
        );
      case 'sentiment':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <SentimentTab organizationId={tabProps.organizationId} />
          </React.Suspense>
        );
      case 'performance':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <PerformanceTab organizationId={tabProps.organizationId} />
          </React.Suspense>
        );
      case 'customer-insights':
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <CustomerInsightsTab organizationId={tabProps.organizationId} />
          </React.Suspense>
        );
      default:
        return (
          <React.Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded"></div>}>
            <DashboardOverviewContent onTabChange={debouncedSetActiveTab} />
          </React.Suspense>
        );
    }
  };

  if (!organization) {
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
        organizationName={organization.name}
        organizationId={organization.id}
        organizationSlug={slug || ''}
        activeTab={activeTab}
        onTabChange={debouncedSetActiveTab}
        stats={stats}
        isLoading={isLoading}
      >
        {renderTabContent()}
      </EnhancedDashboardLayout>
      
      {/* Floating Action Button for mobile quick actions */}
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
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
};
