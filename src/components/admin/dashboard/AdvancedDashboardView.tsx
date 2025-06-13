
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { OperationalAnalytics } from './OperationalAnalytics';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { SessionTrendsChart } from './charts/SessionTrendsChart';
import { UserEngagementChart } from './charts/UserEngagementChart';
import { AnalyticsInsights } from './AnalyticsInsights';
import { QuickActions } from './QuickActions';
import { NotificationCenter } from './NotificationCenter';
import { RecentActivityCard } from '../RecentActivityCard';
import { StatsCards } from './StatsCards';
import { AnalyticsTable } from './AnalyticsTable';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  FileText
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
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights for {organizationName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="live-activity">Live Updates</Label>
            <Switch
              id="live-activity"
              checked={isLiveActivity}
              onCheckedChange={setIsLiveActivity}
            />
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="executive" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Executive</span>
          </TabsTrigger>
          <TabsTrigger value="operational" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Operational</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Real-time</span>
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Detailed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards cards={cards} isLoading={statsLoading} />

          {!statsLoading && stats && stats.total_sessions > 0 && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-sm">
                Overall completion rate: {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}%
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SessionTrendsChart isLoading={statsLoading} />
            <UserEngagementChart isLoading={statsLoading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalyticsInsights stats={stats} isLoading={statsLoading} />
            </div>
            <QuickActions {...handleQuickActions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivityCard 
              recentSessions={stats?.recent_activity} 
              statsLoading={statsLoading} 
            />
            <NotificationCenter />
          </div>
        </TabsContent>

        <TabsContent value="executive" className="space-y-6">
          <ExecutiveDashboard organizationId={organizationId} stats={stats} />
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <OperationalAnalytics organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeAnalytics organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <AnalyticsTable organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
