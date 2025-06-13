
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { useOrganizationStats } from '@/hooks/useOrganizationStats';

interface DashboardOverviewProps {
  organizationId: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  organizationId 
}) => {
  const { data: stats, isLoading } = useOrganizationStats(organizationId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Active Members',
      value: stats?.active_members || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Questions',
      value: stats?.total_questions || 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Sessions',
      value: stats?.total_sessions || 0,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Completed Sessions',
      value: stats?.completed_sessions || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Responses',
      value: stats?.total_responses || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Avg. Score',
      value: stats?.avg_session_score || 0,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      suffix: '/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}{card.suffix || ''}
              </div>
              {card.title === 'Completed Sessions' && stats && stats.total_sessions > 0 && (
                <div className="mt-2">
                  <Badge variant="secondary">
                    {Math.round((stats.completed_sessions / stats.total_sessions) * 100)}% completion rate
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
