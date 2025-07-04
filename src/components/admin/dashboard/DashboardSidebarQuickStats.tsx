
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MessageSquare, Star } from 'lucide-react';

interface DashboardSidebarQuickStatsProps {
  stats: any;
}

export const DashboardSidebarQuickStats: React.FC<DashboardSidebarQuickStatsProps> = ({ stats }) => {
  const quickStats = [
    {
      label: 'Active Members',
      value: stats?.active_members || 0,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Total Responses',
      value: stats?.total_responses || 0,
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      label: 'Avg Rating',
      value: stats?.avg_session_score ? `${stats.avg_session_score.toFixed(1)}★` : '0★',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="mt-6 px-3">
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
          Quick Stats
        </h4>
        <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200">
          <CardContent className="p-4 space-y-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs font-medium text-gray-600">{stat.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </Badge>
                </div>
              );
            })}
            
            {stats?.growth_metrics?.growth_rate && stats.growth_metrics.growth_rate > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Growth</span>
                </div>
                <Badge className="text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                  +{stats.growth_metrics.growth_rate}%
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
