
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernDashboardLayout } from './ModernDashboardLayout';
import { ModernDashboardOverview } from './ModernDashboardOverview';
import { useDashboardData } from './DashboardDataProvider';

// Import existing tab components
import MembersTab from './tabs/MembersTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { QuestionsTab } from './tabs/QuestionsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { SentimentTab } from './tabs/SentimentTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { CustomerInsightsTab } from './tabs/CustomerInsightsTab';

export const ModernOrganizationDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { organization, stats, isLoading } = useDashboardData();

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'members':
        return <MembersTab organization={organization} />;
      case 'feedback':
        return <FeedbackTab organizationId={organization?.id} />;
      case 'questions':
        return <QuestionsTab />;
      case 'settings':
        return <SettingsTab organization={organization} />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'analytics':
        return <SentimentTab organizationId={organization?.id} />;
      case 'performance':
        return <PerformanceTab organizationId={organization?.id} />;
      case 'customer-insights':
        return <CustomerInsightsTab organizationId={organization?.id} />;
      default:
        return (
          <ModernDashboardOverview 
            stats={stats} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernDashboardLayout
      organizationName={organization.name}
      organizationId={organization.id}
      activeSection={activeSection}
      onNavigate={handleNavigate}
      stats={stats}
    >
      {renderContent()}
    </ModernDashboardLayout>
  );
};
