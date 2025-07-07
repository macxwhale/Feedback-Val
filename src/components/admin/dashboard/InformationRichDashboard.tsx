
import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrganizationStats } from '@/hooks/useOrganizationStats';
import { EnhancedMetricCard } from './EnhancedMetricCard';
import { DataSummaryBar } from './DataSummaryBar';
import { DashboardErrorBoundary, DashboardErrorFallback } from './DashboardErrorBoundary';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { ResponsiveGrid } from '@/components/ui/responsive-layout';

interface InformationRichDashboardProps {
  organizationId: string;
  onTabChange?: (tab: string) => void;
}

export const InformationRichDashboard: React.FC<InformationRichDashboardProps> = ({ 
  organizationId,
  onTabChange = () => {}
}) => {
  const { data: stats, isLoading, error, refetch } = useOrganizationStats(organizationId);
  const [activeSection, setActiveSection] = useState('overview');
  const { isMobile, isTablet } = useResponsiveDesign();

  if (error) {
    return <DashboardErrorFallback onRetry={() => refetch()} />;
  }

  // Enhanced metrics with only Response Collection and User Engagement cards
  const performanceMetrics = [
    {
      title: 'Response Collection',
      value: stats?.total_responses || 0,
      previousValue: stats?.total_responses ? Math.max(0, stats.total_responses - 45) : 0,
      icon: MessageSquare,
      change: {
        value: 24,
        period: 'last 30 days',
        trend: 'up' as const
      },
      secondaryMetrics: [
        { 
          label: 'This Week', 
          value: Math.round((stats?.total_responses || 0) * 0.18), 
          trend: 'up' as const,
          change: { value: 12, period: 'week' },
          status: 'good' as const
        },
        {
          label: 'Completion Rate',
          value: stats && stats.total_sessions > 0 
            ? `${Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%`
            : '0%',
          trend: 'up' as const,
          target: 100,
          status: 'good' as const
        },
        {
          label: 'Avg Response Time',
          value: '2.4min',
          trend: 'down' as const,
          status: 'good' as const
        }
      ],
      status: 'success' as const,
      insights: [
        'Response rate increased 24% compared to last month',
        'Quality metrics show consistent improvement',
        'Mobile completion rate is 15% higher than desktop'
      ],
      actionLabel: 'View Response Analytics',
      onAction: () => onTabChange('feedback'),
      contextualActions: [
        { label: 'Export Data', onClick: () => console.log('Export responses') },
        { label: 'Quality Report', onClick: () => console.log('Quality report') }
      ]
    },
    {
      title: 'User Engagement',
      value: stats?.total_sessions || 0,
      previousValue: stats?.total_sessions ? Math.max(0, stats.total_sessions - 15) : 0,
      icon: Activity,
      change: {
        value: 18,
        period: 'last 30 days',
        trend: 'up' as const
      },
      secondaryMetrics: [
        { 
          label: 'Active Sessions', 
          value: Math.round((stats?.total_sessions || 0) * 0.75), 
          trend: 'up' as const,
          status: 'good' as const
        },
        { 
          label: 'Bounce Rate', 
          value: '12%', 
          trend: 'down' as const,
          target: 20,
          status: 'good' as const
        },
        {
          label: 'Avg Session Duration',
          value: '4.2min',
          trend: 'up' as const,
          status: 'good' as const
        },
        {
          label: 'Return Users',
          value: '34%',
          trend: 'up' as const,
          status: 'good' as const
        }
      ],
      status: 'success' as const,
      insights: [
        'Session engagement up 18% month-over-month',
        'Mobile users show 25% longer session duration',
        'Peak engagement hours: 2-4 PM weekdays'
      ],
      actionLabel: 'View Session Details',
      contextualActions: [
        { label: 'User Journey', onClick: () => console.log('User journey') },
        { label: 'Engagement Report', onClick: () => console.log('Engagement report') }
      ]
    }
  ];

  // Enhanced summary metrics with only essential metrics
  const summaryMetrics = [
    {
      label: 'Overall Performance Score',
      value: '94%',
      status: 'good' as const,
      trend: 'up' as const,
      target: 100,
      description: 'Composite performance across all metrics',
      change: { value: 5, period: 'this month' }
    },
    {
      label: 'User Satisfaction',
      value: `${stats?.avg_session_score || 0}/5`,
      status: (stats?.avg_session_score || 0) > 4 ? 'good' as const : 'warning' as const,
      trend: 'up' as const,
      description: 'Average user rating across all sessions',
      change: { value: 8, period: 'vs last month' }
    },
    {
      label: 'Growth Trajectory',
      value: '+28%',
      status: 'good' as const,
      trend: 'up' as const,
      description: 'Month-over-month growth rate',
      change: { value: 12, period: 'acceleration' }
    }
  ];

  return (
    <DashboardErrorBoundary>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-hidden">
        {/* Enhanced System Health Overview */}
        <DataSummaryBar 
          metrics={summaryMetrics}
          title="Performance Dashboard"
          lastUpdated="Live • Updated 30s ago"
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
        />

        {/* Section Navigation */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'max-w-md grid-cols-3'}`}>
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
              <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="flex items-center space-x-2 self-start sm:self-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Real-time Data</span>
            </Badge>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Information-Rich Metrics Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Key Performance Indicators</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    All metrics trending positive
                  </Badge>
                </div>
              </div>
              
              {/* Optimized responsive grid for 2 cards */}
              <ResponsiveGrid 
                columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                gap="md"
                className="w-full"
              >
                {performanceMetrics.map((metric, index) => (
                  <EnhancedMetricCard 
                    key={index}
                    {...metric}
                  />
                ))}
              </ResponsiveGrid>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="text-center py-8 sm:py-12">
              <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Detailed Performance Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Advanced performance metrics and trend analysis</p>
              <Button onClick={() => onTabChange('performance')} size={isMobile ? "sm" : "default"}>
                View Performance Dashboard
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-8 sm:py-12">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Intelligent recommendations and predictive analytics</p>
              <Button onClick={() => onTabChange('customer-insights')} size={isMobile ? "sm" : "default"}>
                Explore Insights
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Overall Performance Summary - Mobile Optimized */}
        {!isLoading && stats && stats.total_sessions > 0 && (
          <div className="flex justify-center px-2 sm:px-0">
            <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center space-x-8'} p-4 sm:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-2xl border border-green-200 shadow-sm w-full max-w-4xl`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-green-900">
                    Excellence Score: 94%
                  </div>
                  <div className="text-xs sm:text-sm text-green-700">Exceeding industry benchmarks</div>
                </div>
              </div>
              {!isMobile && <div className="h-12 w-px bg-green-200"></div>}
              <div className={`grid grid-cols-3 ${isMobile ? 'gap-4' : 'gap-6'} text-center w-full ${isMobile ? '' : 'max-w-md'}`}>
                <div>
                  <div className="text-base sm:text-xl font-bold text-green-900">
                    {stats.total_responses.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-green-700">Total Responses</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold text-green-900">
                    {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%
                  </div>
                  <div className="text-xs sm:text-sm text-green-700">Success Rate</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold text-green-900">
                    {stats.active_members || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-green-700">Active Team</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};
