import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { FloatingActionButton, ScrollToTopFAB } from '@/components/ui/floating-action-button';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { getOrganizationStatsEnhanced } from '@/services/organizationQueries';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { OrganizationStats } from '@/types/organizationStats';
import { Plus, Users, MessageSquare, Activity, Star, TrendingUp } from 'lucide-react';

// Refined Design System Components
import { 
  PageTitle, 
  SectionSubtitle, 
  GoogleCard as MetricCard, 
  MetricLabel, 
  MetricValue, 
  GoogleDashboardCard as DashboardCard,
  GoogleGrid as DashboardGrid,
  GoogleSection as DashboardSection,
  GoogleButton as ActionButton,
  GoogleStatusDot as StatusDot
} from '@/components/ui/google-inspired-design-system';

// Import new layout
import { GoogleInspiredLayout } from './dashboard/GoogleInspiredLayout';

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

// Define types for dashboard metrics
interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  trend?: { value: number; isPositive: boolean };
  status: 'success' | 'warning' | 'error' | 'neutral';
  format?: 'rating';
}

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Safe type conversion with proper fallbacks
  const typedStats: OrganizationStats | null = stats ? (stats as unknown as OrganizationStats) : null;

  const dashboardMetrics: DashboardMetric[] = [
    {
      id: 'members',
      label: 'Active users',
      value: typedStats?.active_members ?? 0,
      icon: Users,
      trend: { value: 12, isPositive: true },
      status: 'success',
    },
    {
      id: 'responses',
      label: 'Total responses',
      value: typedStats?.total_responses ?? 0,
      icon: MessageSquare,
      trend: { value: 8, isPositive: true },
      status: 'success',
    },
    {
      id: 'sessions',
      label: 'Active sessions',
      value: typedStats?.total_sessions ?? 0,
      icon: Activity,
      status: 'neutral',
    },
    {
      id: 'rating',
      label: 'Average rating',
      value: typedStats?.avg_session_score ?? 0,
      icon: Star,
      format: 'rating',
      status: 'success',
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
          <DashboardSection>
            {/* Header Section */}
            <div className="mb-8">
              <PageTitle className="mb-2">Dashboard</PageTitle>
              <SectionSubtitle>
                Here's what's happening with {organization.name} today.
              </SectionSubtitle>
            </div>
            
            {/* Metrics Grid */}
            <DashboardGrid columns={4} className="mb-8">
              {dashboardMetrics.map((metric) => (
                <MetricCard key={metric.id} className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <metric.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <StatusDot variant={metric.status} />
                  </div>
                  
                  <MetricLabel>{metric.label}</MetricLabel>
                  <MetricValue className="mb-2">
                    {metric.format === 'rating' 
                      ? `${metric.value}/5.0`
                      : metric.value.toLocaleString()
                    }
                  </MetricValue>
                  
                  {metric.trend && (
                    <div className="flex items-center text-xs">
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      <span className="text-green-600 font-medium">
                        +{metric.trend.value}%
                      </span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  )}
                </MetricCard>
              ))}
            </DashboardGrid>

            {/* Charts Section */}
            <DashboardCard 
              title="Trend analysis"
              subtitle="Key metrics over the selected period"
              className="mb-8"
            >
              <SessionTrendsChart isLoading={statsLoading} />
            </DashboardCard>
            
            {/* Analytics Section */}
            <DashboardGrid columns={2} className="mb-8">
              <DashboardCard title="Analytics dashboard">
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
              </DashboardCard>
              
              <DashboardCard title="Analytics insights">
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
              </DashboardCard>
            </DashboardGrid>

            {/* Quick Actions */}
            <DashboardCard title="Quick actions">
              <div className="space-y-3">
                <ActionButton
                  onClick={() => setActiveTab('members')}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto border border-gray-200 dark:border-gray-700 rounded hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1 font-sans">
                        Invite new users
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-sans">
                        Add team members to your organization
                      </div>
                    </div>
                  </div>
                </ActionButton>
                
                <ActionButton
                  onClick={() => setActiveTab('questions')}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto border border-gray-200 dark:border-gray-700 rounded hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1 font-sans">
                        Create new question
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-sans">
                        Add questions to your feedback forms
                      </div>
                    </div>
                  </div>
                </ActionButton>
              </div>
            </DashboardCard>
          </DashboardSection>
        );
    }
  };

  return (
    <>
      <GoogleInspiredLayout
        organizationName={organization.name}
        organizationId={organization.id}
        organizationSlug={slug || ''}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={typedStats}
        isLoading={statsLoading}
      >
        {renderTabContent()}
      </GoogleInspiredLayout>
      
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
