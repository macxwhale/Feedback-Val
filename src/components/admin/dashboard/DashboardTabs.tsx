
import React from 'react';

const DashboardOverviewContent = React.lazy(() => 
  import('./DashboardOverviewContent').then(module => ({ default: module.DashboardOverviewContent })).catch(err => {
    console.error('Failed to load DashboardOverviewContent:', err);
    return { default: () => <div className="p-4">Error loading overview content</div> };
  })
);

const MembersTab = React.lazy(() => 
  import('./tabs/MembersTab').then(module => ({ default: module.default })).catch(err => {
    console.error('Failed to load MembersTab:', err);
    return { default: () => <div className="p-4">Error loading members tab</div> };
  })
);

const FeedbackTab = React.lazy(() => 
  import('./tabs/FeedbackTab').then(module => ({ default: module.FeedbackTab })).catch(err => {
    console.error('Failed to load FeedbackTab:', err);
    return { default: () => <div className="p-4">Error loading feedback tab</div> };
  })
);

const QuestionsTab = React.lazy(() => 
  import('./tabs/QuestionsTab').then(module => ({ default: module.QuestionsTab })).catch(err => {
    console.error('Failed to load QuestionsTab:', err);
    return { default: () => <div className="p-4">Error loading questions tab</div> };
  })
);

const SettingsTab = React.lazy(() => 
  import('./tabs/SettingsTab').then(module => ({ default: module.SettingsTab })).catch(err => {
    console.error('Failed to load SettingsTab:', err);
    return { default: () => <div className="p-4">Error loading settings tab</div> };
  })
);

const IntegrationsTab = React.lazy(() => 
  import('./tabs/IntegrationsTab').then(module => ({ default: module.IntegrationsTab })).catch(err => {
    console.error('Failed to load IntegrationsTab:', err);
    return { default: () => <div className="p-4">Error loading integrations tab</div> };
  })
);

const SentimentTab = React.lazy(() => 
  import('./tabs/SentimentTab').then(module => ({ default: module.SentimentTab })).catch(err => {
    console.error('Failed to load SentimentTab:', err);
    return { default: () => <div className="p-4">Error loading sentiment tab</div> };
  })
);

const PerformanceTab = React.lazy(() => 
  import('./tabs/PerformanceTab').then(module => ({ default: module.PerformanceTab })).catch(err => {
    console.error('Failed to load PerformanceTab:', err);
    return { default: () => <div className="p-4">Error loading performance tab</div> };
  })
);

const CustomerInsightsTab = React.lazy(() => 
  import('./tabs/CustomerInsightsTab').then(module => ({ default: module.CustomerInsightsTab })).catch(err => {
    console.error('Failed to load CustomerInsightsTab:', err);
    return { default: () => <div className="p-4">Error loading customer insights tab</div> };
  })
);

interface DashboardTabsProps {
  activeTab: string;
  organization: any;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  organization,
  onTabChange 
}) => {
  const renderTabContent = () => {
    const tabProps = {
      organizationId: organization?.id || '',
      organization
    };

    try {
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
              <DashboardOverviewContent onTabChange={onTabChange} />
            </React.Suspense>
          );
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return <div className="p-4">Error loading tab content</div>;
    }
  };

  return <>{renderTabContent()}</>;
};
