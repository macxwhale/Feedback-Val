
import React from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useOrganizationStats } from '@/hooks/useOrganizationStats';
import { StatsCards } from './StatsCards';
import { DashboardErrorBoundary, DashboardErrorFallback } from './DashboardErrorBoundary';

interface DashboardOverviewProps {
  organizationId: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  organizationId 
}) => {
  const { data: stats, isLoading, error, refetch } = useOrganizationStats(organizationId);

  if (error) {
    return <DashboardErrorFallback onRetry={() => refetch()} />;
  }

  const cards = [
    {
      title: 'Active Members',
      value: stats?.active_members || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: {
        value: 12,
        label: 'vs last month',
        isPositive: true
      }
    },
    {
      title: 'Total Questions',
      value: stats?.total_questions || 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: {
        value: 8,
        label: 'new this month',
        isPositive: true
      }
    },
    {
      title: 'Total Sessions',
      value: stats?.total_sessions || 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: {
        value: 23,
        label: 'vs last month',
        isPositive: true
      }
    },
    {
      title: 'Completed Sessions',
      value: stats?.completed_sessions || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: stats && stats.total_sessions > 0 ? {
        value: Math.round((stats.completed_sessions / stats.total_sessions) * 100),
        label: 'completion rate',
        isPositive: true
      } : undefined
    },
    {
      title: 'Total Responses',
      value: stats?.total_responses || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: {
        value: 34,
        label: 'vs last month',
        isPositive: true
      }
    },
    {
      title: 'Avg. Score',
      value: stats?.avg_session_score || 0,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      suffix: '/5',
      trend: {
        value: 5,
        label: 'improvement',
        isPositive: true
      }
    }
  ];

  return (
    <DashboardErrorBoundary>
      <div className="space-y-6">
        <StatsCards cards={cards} isLoading={isLoading} />
        
        {/* Additional completion rate badge for completed sessions card */}
        {!isLoading && stats && stats.total_sessions > 0 && (
          <div className="flex justify-center">
            <Badge variant="outline" className="text-sm">
              Overall completion rate: {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%
            </Badge>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};
