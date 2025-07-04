
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedDashboardLayout } from './dashboard/EnhancedDashboardLayout';
import { FloatingActionButton, ScrollToTopFAB } from '@/components/ui/floating-action-button';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { Plus } from 'lucide-react';

// Data Provider
import { DashboardDataProvider, useDashboardData } from './dashboard/DashboardDataProvider';

// Content Components
import { DashboardOverviewContent } from './dashboard/DashboardOverviewContent';

// Tab components
import MembersTab from './dashboard/tabs/MembersTab';
import { FeedbackTab } from './dashboard/tabs/FeedbackTab';
import { QuestionsTab } from './dashboard/tabs/QuestionsTab';
import { SettingsTab } from './dashboard/tabs/SettingsTab';
import { IntegrationsTab } from './dashboard/tabs/IntegrationsTab';
import { SentimentTab } from './dashboard/tabs/SentimentTab';
import { PerformanceTab } from './dashboard/tabs/PerformanceTab';
import { CustomerInsightsTab } from './dashboard/tabs/CustomerInsightsTab';

const DashboardContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile } = useResponsiveDesign();
  const { organization, stats, isLoading } = useDashboardData();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <MembersTab organization={organization} />;
      case 'feedback':
        return <FeedbackTab organizationId={organization.id} />;
      case 'questions':
        return <QuestionsTab />;
      case 'settings':
        return <SettingsTab organization={organization} />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'sentiment':
        return <SentimentTab organizationId={organization.id} />;
      case 'performance':
        return <PerformanceTab organizationId={organization.id} />;
      case 'customer-insights':
        return <CustomerInsightsTab organizationId={organization.id} />;
      default:
        return <DashboardOverviewContent onTabChange={setActiveTab} />;
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <EnhancedDashboardLayout
        organizationName={organization.name}
        organizationId={organization.id}
        organizationSlug={slug || ''}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
        isLoading={isLoading}
      >
        {renderTabContent()}
      </EnhancedDashboardLayout>
      
      {/* Floating Action Button for mobile */}
      {isMobile && activeTab === 'overview' && (
        <FloatingActionButton
          onClick={() => setActiveTab('members')}
          extended
        >
          <Plus className="w-5 h-5" />
          Quick Action
        </FloatingActionButton>
      )}
      
      <ScrollToTopFAB />
    </>
  );
};

export const OrganizationAdminDashboard: React.FC = () => {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
};
