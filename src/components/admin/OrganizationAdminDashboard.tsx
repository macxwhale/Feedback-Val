import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { EnhancedDashboardLayout } from './dashboard/EnhancedDashboardLayout';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { DesignText, DesignCard, DesignButton, spacing } from '@/components/ui/design-system';
import { FloatingActionButton, ScrollToTopFAB } from '@/components/ui/floating-action-button';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { getOrganizationStatsEnhanced } from '@/services/organizationQueries';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { OrganizationStats } from '@/types/organizationStats';
import { Plus, Users, MessageSquare, Activity, Star } from 'lucide-react';

// Tab components
import MembersTab from './dashboard/tabs/MembersTab';
import { FeedbackTab } from './dashboard/tabs/FeedbackTab';
import { QuestionsTab } from './dashboard/tabs/QuestionsTab';
import { SettingsTab } from './dashboard/tabs/SettingsTab';
import { IntegrationsTab } from './dashboard/tabs/IntegrationsTab';
import { SentimentTab } from './dashboard/tabs/SentimentTab';
import { PerformanceTab } from './dashboard/tabs/PerformanceTab';
import { CustomerInsightsTab } from './dashboard/tabs/CustomerInsightsTab';

// Import analytics components
import { AnalyticsTable } from './dashboard/AnalyticsTable';
import { AnalyticsInsights } from './dashboard/AnalyticsInsights';
import { SessionTrendsChart } from './dashboard/charts/SessionTrendsChart';

export const OrganizationAdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { organization, loading: orgLoading } = useOrganization();
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile } = useResponsiveDesign();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['organization-stats', organization?.id],
    queryFn: () => getOrganizationStatsEnhanced(organization!.id),
    enabled: !!organization?.id,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData(organization?.id || '');

  if (orgLoading || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <DesignCard padding="lg">
          <DesignText.Body>Loading dashboard...</DesignText.Body>
        </DesignCard>
      </div>
    );
  }

  const typedStats: OrganizationStats | null = stats ? (stats as unknown as OrganizationStats) : null;

  const dashboardStats = [
    {
      id: 'members',
      title: 'Active Members',
      value: typedStats?.active_members ?? 0,
      icon: Users,
      trend: 'up' as const,
      trendValue: 12,
      color: 'blue' as const,
    },
    {
      id: 'responses',
      title: 'Total Responses',
      value: typedStats?.total_responses ?? 0,
      icon: MessageSquare,  
      trend: 'up' as const,
      trendValue: 8,
      color: 'green' as const,
    },
    {
      id: 'sessions',
      title: 'Active Sessions',
      value: typedStats?.total_sessions ?? 0,
      icon: Activity,
      color: 'purple' as const,
    },
    {
      id: 'rating',
      title: 'Avg Rating',
      value: typedStats?.avg_session_score ?? 0,
      format: 'rating' as const,
      icon: Star,
      color: 'orange' as const,
    },
  ];

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
        return (
          <div className="space-y-8">
            {/* Overview Header */}
            <DesignCard padding="lg" className={spacing.element}>
              <DesignText.Heading2 className="mb-2">Analytics Overview</DesignText.Heading2>
              <DesignText.Body>Key metrics and insights for {organization.name}</DesignText.Body>
            </DesignCard>
            
            {/* Stats Grid */}
            <StatsGrid
              stats={dashboardStats}
              isLoading={statsLoading}
              columns={4}
            />

            {/* Chart Section */}
            <DesignCard padding="lg" className={spacing.element}>
              <DesignText.Heading2 className="mb-4">Trend Analysis</DesignText.Heading2>
              <DesignText.BodySmall className="text-gray-600 mb-6">
                Key metrics over the selected period
              </DesignText.BodySmall>
              <SessionTrendsChart isLoading={statsLoading} />
            </DesignCard>
            
            {/* Analytics Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DesignCard padding="lg">
                <div className="mb-6">
                  <DesignText.Heading2>Analytics Dashboard</DesignText.Heading2>
                </div>
                <AnalyticsTable 
                  questions={analyticsData?.questions || []}
                  categories={analyticsData?.categories || []}
                  summary={analyticsData?.summary || {
                    total_questions: typedStats?.total_questions ?? 0,
                    total_responses: typedStats?.total_responses ?? 0,
                    overall_avg_score: typedStats?.avg_session_score ?? 0,
                    overall_completion_rate: typedStats?.completed_sessions && typedStats?.total_sessions 
                      ? Math.round((typedStats.completed_sessions / typedStats.total_sessions) * 100)
                      : 0
                  }}
                />
              </DesignCard>
              
              <DesignCard padding="lg">
                <div className="mb-6">
                  <DesignText.Heading2>Analytics Insights</DesignText.Heading2>
                </div>
                <AnalyticsInsights 
                  stats={typedStats ? {
                    total_questions: typedStats.total_questions,
                    total_responses: typedStats.total_responses,
                    total_sessions: typedStats.total_sessions,
                    completed_sessions: typedStats.completed_sessions,
                    active_members: typedStats.active_members,
                    avg_session_score: typedStats.avg_session_score,
                    growth_metrics: typedStats.growth_metrics || {
                      sessions_this_month: 0,
                      sessions_last_month: 0,
                      growth_rate: null
                    }
                  } : undefined}
                  isLoading={statsLoading}
                />
              </DesignCard>
            </div>

            {/* Quick Actions */}
            <DesignCard padding="lg">
              <DesignText.Heading2 className="mb-6">Quick Actions</DesignText.Heading2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DesignButton
                  variant="secondary"
                  onClick={() => setActiveTab('members')}
                  className="p-4 h-auto flex items-center gap-3 justify-start"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Invite new members</div>
                    <div className="text-sm text-gray-600">Add team members to your organization</div>
                  </div>
                </DesignButton>
                <DesignButton
                  variant="secondary"
                  onClick={() => setActiveTab('questions')}
                  className="p-4 h-auto flex items-center gap-3 justify-start"
                >
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Create new question</div>
                    <div className="text-sm text-gray-600">Design feedback forms</div>
                  </div>
                </DesignButton>
              </div>
            </DesignCard>
          </div>
        );
    }
  };

  return (
    <>
      <EnhancedDashboardLayout
        organizationName={organization.name}
        organizationId={organization.id}
        organizationSlug={slug || ''}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={typedStats}
        isLoading={statsLoading}
      >
        {renderTabContent()}
      </EnhancedDashboardLayout>
      
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
