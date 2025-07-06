
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

  // Enhanced cards with more detailed information
  const cards = [
    {
      title: 'Total Questions',
      value: stats?.total_questions || 0,
      previousValue: stats?.total_questions ? Math.max(0, stats.total_questions - 5) : 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: {
        value: 8,
        label: 'this month',
        isPositive: true
      },
      secondaryMetrics: [
        { label: 'Active Questions', value: Math.round((stats?.total_questions || 0) * 0.8), trend: 'up' as const },
        { label: 'Draft Questions', value: Math.round((stats?.total_questions || 0) * 0.2), trend: 'neutral' as const }
      ],
      status: 'success' as const,
      actionLabel: 'Manage Questions',
      onAction: () => onTabChange('questions')
    },
    {
      title: 'Total Sessions',
      value: stats?.total_sessions || 0,
      previousValue: stats?.total_sessions ? Math.max(0, stats.total_sessions - 12) : 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: {
        value: 23,
        label: 'vs last month',
        isPositive: true
      },
      secondaryMetrics: [
        { label: 'This Week', value: Math.round((stats?.total_sessions || 0) * 0.3), trend: 'up' as const },
        { label: 'Avg Daily', value: Math.round((stats?.total_sessions || 0) / 30), trend: 'up' as const }
      ],
      status: 'normal' as const,
      actionLabel: 'View Analytics'
    },
    {
      title: 'Completed Sessions',
      value: stats?.completed_sessions || 0,
      previousValue: stats?.completed_sessions ? Math.max(0, stats.completed_sessions - 8) : 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: stats && stats.total_sessions > 0 ? {
        value: Math.round((stats.completed_sessions / stats.total_sessions) * 100),
        label: 'completion rate',
        isPositive: true
      } : undefined,
      secondaryMetrics: [
        { 
          label: 'Completion Rate', 
          value: stats && stats.total_sessions > 0 
            ? `${Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%`
            : '0%',
          trend: 'up' as const
        },
        { label: 'Avg Time', value: '4.2min', trend: 'down' as const }
      ],
      status: stats && stats.total_sessions > 0 && (stats.completed_sessions / stats.total_sessions) > 0.8 
        ? 'success' as const 
        : stats && stats.total_sessions > 0 && (stats.completed_sessions / stats.total_sessions) > 0.6
        ? 'normal' as const
        : 'warning' as const,
      actionLabel: 'Improve Completion'
    },
    {
      title: 'Total Responses',
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
        { label: 'Recent Responses', value: Math.round((stats?.total_responses || 0) * 0.15), trend: 'up' as const },
        { label: 'Response Rate', value: '87%', trend: 'up' as const }
      ],
      status: 'success' as const,
      actionLabel: 'View Feedback',
      onAction: () => onTabChange('feedback')
    }
  ];

  // Summary metrics for the data bar
  const summaryMetrics = [
    {
      label: 'Overall Health',
      value: '94%',
      status: 'good' as const,
      trend: 'up' as const,
      target: 100
    },
    {
      label: 'Active Sessions',
      value: stats?.total_sessions || 0,
      status: (stats?.total_sessions || 0) > 50 ? 'good' as const : 'warning' as const,
      trend: 'up' as const
    },
    {
      label: 'Response Quality',
      value: '4.8/5',
      status: 'good' as const,
      trend: 'stable' as const
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      status: 'good' as const,
      trend: 'stable' as const
    }
  ];

  return (
    <DashboardErrorBoundary>
      <div className="space-y-6">
        {/* Summary Performance Bar */}
        <DataSummaryBar 
          metrics={summaryMetrics}
          title="System Health Overview"
        />

        {/* Enhanced Statistics Cards */}
        <StatsCards 
          cards={cards} 
          isLoading={isLoading}
          onCardAction={(cardTitle) => {
            // Handle card actions based on card title
            if (cardTitle.includes('Questions')) onTabChange('questions');
            else if (cardTitle.includes('Responses')) onTabChange('feedback');
            else if (cardTitle.includes('Sessions')) onTabChange('customer-insights');
          }}
        />

        {/* Quick Actions Panel */}
        <QuickActionPanel 
          onTabChange={onTabChange}
          stats={{
            pending_invitations: 2,
            unread_responses: stats?.total_responses ? Math.round(stats.total_responses * 0.1) : 0
          }}
        />

        {/* Completion Rate Badge (maintained from original) */}
        {!isLoading && stats && stats.total_sessions > 0 && (
          <div className="flex justify-center">
            <Badge variant="outline" className="text-sm px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Overall completion rate: {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%
            </Badge>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};
