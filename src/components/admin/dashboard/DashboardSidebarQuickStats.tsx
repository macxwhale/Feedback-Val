
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, MessageSquare, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarQuickStatsProps {
  stats: any;
}

export const DashboardSidebarQuickStats: React.FC<DashboardSidebarQuickStatsProps> = ({ stats }) => {
  const quickStats = [
    {
      label: 'Growth',
      value: stats?.growth_metrics?.growth_rate ? `+${stats.growth_metrics.growth_rate}%` : '0%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Members',
      value: stats?.active_members || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Responses',
      value: stats?.total_responses || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Questions',
      value: stats?.total_questions || 0,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <Card className="border-gray-200/50 shadow-sm bg-gradient-to-b from-gray-50/50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg transition-all duration-200",
                "hover:shadow-sm border border-gray-100",
                stat.bgColor
              )}
            >
              <stat.icon className={cn("w-4 h-4 mb-1", stat.color)} />
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 text-center leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
