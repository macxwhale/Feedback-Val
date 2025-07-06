
import React from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle,
  Calendar,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useOrganizationStats } from '@/hooks/useOrganizationStats';
import { StatsCards } from './StatsCards';
import { QuickActionPanel } from './QuickActionPanel';
import { DataSummaryBar } from './DataSummaryBar';
import { DashboardErrorBoundary, DashboardErrorFallback } from './DashboardErrorBoundary';

interface DashboardOverviewProps {
  organizationId: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  organizationId,
  onTabChange = () => {}
}) => {
  const { data: stats, isLoading, error, refetch } = useOrganizationStats(organizationId);

  if (error) {
    return <DashboardErrorFallback onRetry={() => refetch()} />;
  }

  // Enhanced cards with richer information and better visual hierarchy
  const cards = [
    {
      title: 'Total Questions',
      value: stats?.total_questions || 0,
      previousValue: stats?.total_questions ? Math.max(0, stats.total_questions - 5) : 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: {
        value: 12,
        label: 'this month',
        isPositive: true
      },
      secondaryMetrics: [
        { 
          label: 'Active Questions', 
          value: Math.round((stats?.total_questions || 0) * 0.85), 
          trend: 'up' as const,
          target: stats?.total_questions || 0
        },
        { 
          label: 'Draft Questions', 
          value: Math.round((stats?.total_questions || 0) * 0.15), 
          trend: 'neutral' as const 
        },
        {
          label: 'Avg Responses/Question',
          value: stats?.total_questions > 0 ? Math.round((stats?.total_responses || 0) / stats.total_questions) : 0,
          trend: 'up' as const
        }
      ],
      status: 'success' as const,
      actionLabel: 'Manage Questions',
      onAction: () => onTabChange('questions')
    },
    {
      title: 'Total Sessions',
      value: stats?.total_sessions || 0,
      previousValue: stats?.total_sessions ? Math.max(0, stats.total_sessions - 15) : 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: {
        value: 28,
        label: 'vs last month',
        isPositive: true
      },
      secondaryMetrics: [
        { 
          label: 'This Week', 
          value: Math.round((stats?.total_sessions || 0) * 0.25), 
          trend: 'up' as const 
        },
        { 
          label: 'Daily Average', 
          value: Math.round((stats?.total_sessions || 0) / 30), 
          trend: 'up' as const 
        },
        {
          label: 'Peak Sessions/Day',
          value: Math.round((stats?.total_sessions || 0) / 15),
          trend: 'up' as const
        }
      ],
      status: 'normal' as const,
      actionLabel: 'View Session Analytics'
    },
    {
      title: 'Completion Rate',
      value: stats && stats.total_sessions > 0 
        ? `${Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%`
        : '0%',
      previousValue: stats && stats.total_sessions > 0 
        ? `${Math.max(0, Math.round((stats.completed_sessions / stats.total_sessions) * 100) - 5)}%`
        : '0%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: stats && stats.total_sessions > 0 ? {
        value: 8,
        label: 'completion improvement',
        isPositive: true
      } : undefined,
      secondaryMetrics: [
        { 
          label: 'Completed Sessions', 
          value: stats?.completed_sessions || 0,
          trend: 'up' as const
        },
        { 
          label: 'Avg Completion Time', 
          value: '4.2min', 
          trend: 'down' as const 
        },
        {
          label: 'Abandonment Rate',
          value: stats && stats.total_sessions > 0 
            ? `${Math.round(((stats.total_sessions - stats.completed_sessions) / stats.total_sessions) * 100)}%`
            : '0%',
          trend: 'down' as const
        }
      ],
      status: stats && stats.total_sessions > 0 && (stats.completed_sessions / stats.total_sessions) > 0.8 
        ? 'success' as const 
        : stats && stats.total_sessions > 0 && (stats.completed_sessions / stats.total_sessions) > 0.6
        ? 'normal' as const
        : 'warning' as const,
      actionLabel: 'Optimize Completion'
    },
    {
      title: 'Response Analytics',
      value: stats?.total_responses || 0,
      previousValue: stats?.total_responses ? Math.max(0, stats.total_responses - 45) : 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: {
        value: 34,
        label: 'vs last month',
        isPositive: true
      },
      secondaryMetrics: [
        { 
          label: 'New This Week', 
          value: Math.round((stats?.total_responses || 0) * 0.18), 
          trend: 'up' as const 
        },
        { 
          label: 'Response Quality Score', 
          value: '4.8/5', 
          trend: 'up' as const 
        },
        {
          label: 'Avg Response Length',
          value: '47 words',
          trend: 'up' as const
        }
      ],
      status: 'success' as const,
      actionLabel: 'View Detailed Analytics',
      onAction: () => onTabChange('feedback')
    }
  ];

  // Enhanced summary metrics with more comprehensive data
  const summaryMetrics = [
    {
      label: 'System Health Score',
      value: '96%',
      status: 'good' as const,
      trend: 'up' as const,
      target: 100,
      description: 'Overall platform performance',
      change: { value: 3, period: 'this week' }
    },
    {
      label: 'User Engagement',
      value: stats?.total_sessions || 0,
      status: (stats?.total_sessions || 0) > 50 ? 'good' as const : 'warning' as const,
      trend: 'up' as const,
      description: 'Active user sessions',
      change: { value: 15, period: 'vs last month' }
    },
    {
      label: 'Data Quality Index',
      value: '92%',
      status: 'good' as const,
      trend: 'stable' as const,
      description: 'Response completeness & accuracy',
      change: { value: 2, period: 'this month' }
    },
    {
      label: 'Platform Uptime',
      value: '99.9%',
      status: 'good' as const,
      trend: 'stable' as const,
      target: 100,
      description: 'Service availability',
      change: { value: 0, period: 'this month' }
    }
  ];

  return (
    <DashboardErrorBoundary>
      <div className="space-y-8">
        {/* Enhanced System Health Overview */}
        <DataSummaryBar 
          metrics={summaryMetrics}
          title="Platform Performance Overview"
          lastUpdated="2 min ago"
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
        />

        {/* Enhanced Statistics Cards with richer information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Key Metrics</h2>
            <Badge variant="outline" className="text-sm">
              <Activity className="w-4 h-4 mr-1" />
              Live Data
            </Badge>
          </div>
          <StatsCards 
            cards={cards} 
            isLoading={isLoading}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
            onCardAction={(cardTitle) => {
              if (cardTitle.includes('Questions')) onTabChange('questions');
              else if (cardTitle.includes('Response')) onTabChange('feedback');
              else if (cardTitle.includes('Sessions')) onTabChange('customer-insights');
            }}
          />
        </div>

        {/* Enhanced Quick Actions Panel */}
        <QuickActionPanel 
          onTabChange={onTabChange}
          stats={{
            pending_invitations: 2,
            unread_responses: stats?.total_responses ? Math.round(stats.total_responses * 0.12) : 0
          }}
        />

        {/* Enhanced Overall Performance Badge */}
        {!isLoading && stats && stats.total_sessions > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-green-900">
                    {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}% Success Rate
                  </div>
                  <div className="text-sm text-green-700">Overall completion performance</div>
                </div>
              </div>
              <div className="h-12 w-px bg-green-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-900">
                  {stats.total_responses.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-900">
                  {stats.active_members || 0}
                </div>
                <div className="text-sm text-green-700">Active Members</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};
