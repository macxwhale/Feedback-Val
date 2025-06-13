
import React from 'react';
import { SessionTrendsChart } from './charts/SessionTrendsChart';
import { UserEngagementChart } from './charts/UserEngagementChart';
import { AnalyticsInsights } from './AnalyticsInsights';
import { QuickActions } from './QuickActions';
import { NotificationCenter } from './NotificationCenter';
import { RecentActivityCard } from '../RecentActivityCard';
import { StatsCards } from './StatsCards';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle 
} from 'lucide-react';

interface AdvancedDashboardViewProps {
  organizationId: string;
  organizationName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: any;
  isLiveActivity: boolean;
  setIsLiveActivity: (isLive: boolean) => void;
  handleQuickActions: {
    onCreateQuestion: () => void;
    onInviteUser: () => void;
    onExportData: () => void;
    onViewSettings: () => void;
  };
}

export const AdvancedDashboardView: React.FC<AdvancedDashboardViewProps> = ({
  organizationId,
  organizationName,
  activeTab,
  onTabChange,
  stats,
  isLiveActivity,
  setIsLiveActivity,
  handleQuickActions
}) => {
  const statsLoading = !stats;

  // Create stats cards configuration
  const cards = [
    {
      title: 'Active Members',
      value: stats?.active_members || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: stats?.growth_metrics?.growth_rate ? {
        value: Math.abs(stats.growth_metrics.growth_rate),
        label: 'vs last month',
        isPositive: stats.growth_metrics.growth_rate > 0
      } : {
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
      } : {
        value: 85,
        label: 'completion rate',
        isPositive: true
      }
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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-600">Real-time insights for {organizationName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="live-activity">Live Updates</Label>
          <Switch
            id="live-activity"
            checked={isLiveActivity}
            onCheckedChange={setIsLiveActivity}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards cards={cards} isLoading={statsLoading} />

      {/* Completion Rate Badge */}
      {!statsLoading && stats && stats.total_sessions > 0 && (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-sm">
            Overall completion rate: {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%
          </Badge>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionTrendsChart isLoading={statsLoading} />
        <UserEngagementChart isLoading={statsLoading} />
      </div>

      {/* Analytics and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsInsights stats={stats} isLoading={statsLoading} />
        </div>
        <QuickActions {...handleQuickActions} />
      </div>

      {/* Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard 
          recentSessions={stats?.recent_activity} 
          statsLoading={statsLoading} 
        />
        <NotificationCenter />
      </div>
    </div>
  );
};
