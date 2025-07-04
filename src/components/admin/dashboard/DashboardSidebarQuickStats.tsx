
import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarQuickStatsProps {
  stats: any;
}

export const DashboardSidebarQuickStats: React.FC<DashboardSidebarQuickStatsProps> = ({ stats }) => {
  const quickStats = [
    {
      label: 'Active Users',
      value: stats?.active_members || 0,
      icon: Users,
      trend: 'positive',
      change: '+12%'
    },
    {
      label: 'Response Rate',
      value: stats?.completion_rate ? `${Math.round(stats.completion_rate)}%` : '0%',
      icon: Activity,
      trend: stats?.completion_rate > 75 ? 'positive' : 'neutral',
      change: '+5%'
    },
    {
      label: 'Growth',
      value: stats?.growth_metrics?.growth_rate ? `${stats.growth_metrics.growth_rate}%` : '0%',
      icon: stats?.growth_metrics?.growth_rate > 0 ? TrendingUp : TrendingDown,
      trend: stats?.growth_metrics?.growth_rate > 0 ? 'positive' : 'negative',
      change: stats?.growth_metrics?.growth_rate ? `${stats.growth_metrics.growth_rate}%` : '0%'
    }
  ];

  return (
    <SidebarGroup className="px-4 mt-8 pt-6 border-t border-gray-100">
      <SidebarGroupLabel className="uppercase font-bold tracking-wider text-gray-600 text-xs px-2 py-2">
        Quick Stats
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-3 mt-2">
          {quickStats.map((stat, index) => (
            <Card key={index} className="shadow-sm border-gray-100 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      stat.trend === 'positive' ? "bg-green-100 text-green-600" :
                      stat.trend === 'negative' ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      <stat.icon className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-xs font-medium",
                    stat.trend === 'positive' ? "text-green-600" :
                    stat.trend === 'negative' ? "text-red-600" :
                    "text-gray-500"
                  )}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
