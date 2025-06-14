
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';
import { TrendingUp } from 'lucide-react';

interface DashboardSidebarQuickStatsProps {
  stats: any;
}

export const DashboardSidebarQuickStats: React.FC<DashboardSidebarQuickStatsProps> = ({ stats }) => {
  if (!stats) return null;
  return (
    <SidebarGroup className="pt-5 mt-6 border-t border-gray-200 dark:border-sidebar-border px-3">
      <SidebarGroupLabel className="uppercase font-extrabold tracking-wider text-orange-700 dark:text-sidebar-accent text-xs pb-1">
        Quick Stats
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-3 py-2 space-y-2 bg-orange-50/80 dark:bg-sidebar-accent/50 rounded-lg shadow-xs">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-200">Completion Rate</span>
            <span className="font-medium">
              {stats.total_sessions > 0
                ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
                : 0}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-200">Avg Score</span>
            <span className="font-medium">
              {stats.avg_session_score || 0}/5
            </span>
          </div>
          {stats.growth_metrics?.growth_rate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-200">Growth</span>
              <span className={`font-medium flex items-center ${
                stats.growth_metrics.growth_rate > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {stats.growth_metrics.growth_rate}%
              </span>
            </div>
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
