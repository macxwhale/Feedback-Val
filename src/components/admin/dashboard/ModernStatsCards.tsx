
import React from 'react';
import { MetricCard } from '@/components/ui/modern-card';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Star,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface ModernStatsCardsProps {
  stats?: {
    active_members: number;
    total_responses: number;
    total_sessions: number;
    avg_session_score: number;
    completed_sessions?: number;
    growth_metrics?: {
      growth_rate: number;
    };
  };
  isLoading?: boolean;
}

export const ModernStatsCards: React.FC<ModernStatsCardsProps> = ({
  stats,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Active Members"
        value={stats?.active_members ?? 0}
        icon={Users}
        trend={{
          value: 12,
          label: "vs last month",
          isPositive: true
        }}
        color="blue"
      />
      
      <MetricCard
        title="Total Responses"
        value={stats?.total_responses ?? 0}
        icon={MessageSquare}
        trend={{
          value: stats?.growth_metrics?.growth_rate ?? 8,
          label: "vs last period",
          isPositive: (stats?.growth_metrics?.growth_rate ?? 8) > 0
        }}
        color="green"
      />
      
      <MetricCard
        title="Active Sessions"
        value={stats?.total_sessions ?? 0}
        icon={Activity}
        color="purple"
      />
      
      <MetricCard
        title="Avg Rating"
        value={stats?.avg_session_score ?? 0}
        icon={Star}
        color="orange"
      />
    </div>
  );
};
