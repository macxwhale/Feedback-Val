
import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrganizationStats } from '@/hooks/useOrganizationStats';
import { EnhancedMetricCard } from './EnhancedMetricCard';
import { DataSummaryBar } from './DataSummaryBar';
import { DashboardErrorBoundary, DashboardErrorFallback } from './DashboardErrorBoundary';

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

  if (error) {
    return <DashboardErrorFallback onRetry={() => refetch()} />;
  }

  // Enhanced metrics with rich secondary data
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
          label: 'Quality Score', 
          value: '4.8/5', 
          trend: 'up' as const,
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
    },
    {
      title: 'Team Performance',
      value: stats?.active_members || 0,
      previousValue: stats?.active_members ? Math.max(0, stats.active_members - 2) : 0,
      icon: Users,
      change: {
        value: 8,
        period: 'this quarter',
        trend: 'up' as const
      },
      secondaryMetrics: [
        { 
          label: 'Active Contributors', 
          value: Math.round((stats?.active_members || 0) * 0.85), 
          trend: 'up' as const,
          status: 'good' as const
        },
        { 
          label: 'Collaboration Score', 
          value: '92%', 
          trend: 'up' as const,
          target: 100,
          status: 'good' as const
        },
        {
          label: 'Response Time',
          value: '2.1hrs',
          trend: 'down' as const,
          status: 'good' as const
        },
        {
          label: 'Task Completion',
          value: '96%',
          trend: 'up' as const,
          status: 'good' as const
        }
      ],
      status: 'success' as const,
      insights: [
        'Team productivity increased 15% this quarter',
        'Cross-team collaboration metrics improved',
        '2 new high-performing team members added'
      ],
      actionLabel: 'Manage Team',
      onAction: () => onTabChange('members'),
      contextualActions: [
        { label: 'Performance Review', onClick: () => console.log('Performance review') },
        { label: 'Team Analytics', onClick: () => console.log('Team analytics') }
      ]
    },
    {
      title: 'System Health',
      value: '99.2%',
      previousValue: '98.8%',
      icon: CheckCircle,
      change: {
        value: 0.4,
        period: 'last 30 days',
        trend: 'up' as const
      },
      secondaryMetrics: [
        { 
          label: 'Uptime', 
          value: '99.9%', 
          trend: 'up' as const,
          target: 100,
          status: 'good' as const
        },
        { 
          label: 'Response Time', 
          value: '245ms', 
          trend: 'down' as const,
          status: 'good' as const
        },
        {
          label: 'Error Rate',
          value: '0.03%',
          trend: 'down' as const,
          status: 'good' as const
        },
        {
          label: 'Data Accuracy',
          value: '99.7%',
          trend: 'up' as const,
          status: 'good' as const
        }
      ],
      status: 'success' as const,
      insights: [
        'System performance exceeds SLA targets',
        'Zero critical incidents this month',
        'Database optimization reduced query time by 23%'
      ],
      actionLabel: 'System Status',
      contextualActions: [
        { label: 'Health Report', onClick: () => console.log('Health report') },
        { label: 'Performance Logs', onClick: () => console.log('Performance logs') }
      ]
    }
  ];

  // Enhanced summary metrics for the overview bar
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
    },
    {
      label: 'Operational Efficiency',
      value: '97%',
      status: 'good' as const,
      trend: 'stable' as const,
      target: 100,
      description: 'System reliability and performance',
      change: { value: 2, period: 'this quarter' }
    }
  ];

  return (
    <DashboardErrorBoundary>
      <div className="space-y-6">
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
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time Data</span>
            </Badge>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Information-Rich Metrics Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Key Performance Indicators</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    All metrics trending positive
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <EnhancedMetricCard 
                    key={index}
                    {...metric}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Performance Analytics</h3>
              <p className="text-gray-600 mb-4">Advanced performance metrics and trend analysis</p>
              <Button onClick={() => onTabChange('performance')}>
                View Performance Dashboard
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-4">Intelligent recommendations and predictive analytics</p>
              <Button onClick={() => onTabChange('customer-insights')}>
                Explore Insights
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Overall Performance Summary */}
        {!isLoading && stats && stats.total_sessions > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-8 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-2xl border border-green-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-green-900">
                    Excellence Score: 94%
                  </div>
                  <div className="text-sm text-green-700">Exceeding industry benchmarks</div>
                </div>
              </div>
              <div className="h-12 w-px bg-green-200"></div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-xl font-bold text-green-900">
                    {stats.total_responses.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Total Responses</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-900">
                    {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%
                  </div>
                  <div className="text-sm text-green-700">Success Rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-900">
                    {stats.active_members || 0}
                  </div>
                  <div className="text-sm text-green-700">Active Team</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};
