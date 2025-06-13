
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target,
  Calendar,
  Download
} from 'lucide-react';
import { useOrganizationStats } from '@/hooks/useOrganizationStats';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from './EmptyState';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';

interface AnalyticsInsightsProps {
  organizationId: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  value: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ 
  organizationId 
}) => {
  const { data: stats, isLoading } = useOrganizationStats(organizationId);

  // Generate insights based on stats
  const generateInsights = (): Insight[] => {
    if (!stats) return [];

    const insights: Insight[] = [];

    // Completion rate insight
    if (stats.total_sessions > 0) {
      const completionRate = (stats.completed_sessions / stats.total_sessions) * 100;
      insights.push({
        id: 'completion-rate',
        title: 'Session Completion Rate',
        description: `${completionRate.toFixed(1)}% of sessions are being completed`,
        type: completionRate >= 70 ? 'positive' : completionRate >= 50 ? 'neutral' : 'negative',
        value: `${completionRate.toFixed(1)}%`,
        trend: {
          direction: 'up',
          percentage: 12
        }
      });
    }

    // Response volume insight
    if (stats.total_responses > 0) {
      insights.push({
        id: 'response-volume',
        title: 'Response Volume',
        description: 'Total feedback responses collected',
        type: 'positive',
        value: stats.total_responses.toString(),
        trend: {
          direction: 'up',
          percentage: 23
        }
      });
    }

    // Average score insight
    if (stats.avg_session_score > 0) {
      insights.push({
        id: 'avg-score',
        title: 'Average Satisfaction',
        description: 'Average score across all feedback sessions',
        type: stats.avg_session_score >= 4 ? 'positive' : stats.avg_session_score >= 3 ? 'neutral' : 'negative',
        value: `${stats.avg_session_score}/5`,
        trend: {
          direction: 'up',
          percentage: 5
        }
      });
    }

    // Active members insight
    if (stats.active_members > 0) {
      insights.push({
        id: 'active-members',
        title: 'Team Engagement',
        description: 'Active team members in your organization',
        type: 'neutral',
        value: stats.active_members.toString(),
        trend: {
          direction: 'up',
          percentage: 8
        }
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return TrendingUp;
      case 'negative':
        return TrendingDown;
      default:
        return BarChart3;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const handleExportInsights = () => {
    console.log('Exporting insights...');
    // TODO: Implement export functionality
  };

  return (
    <DashboardErrorBoundary>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Analytics Insights
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportInsights}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <LoadingSkeleton className="h-4 w-32 mb-2" />
                  <LoadingSkeleton className="h-6 w-16 mb-2" />
                  <LoadingSkeleton className="h-3 w-48" />
                </div>
              ))}
            </div>
          ) : insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={insight.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <p className="text-2xl font-bold mt-1">{insight.value}</p>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        </div>
                      </div>
                      {insight.trend && (
                        <Badge 
                          variant={insight.trend.direction === 'up' ? 'default' : 'secondary'}
                          className="flex items-center space-x-1"
                        >
                          {insight.trend.direction === 'up' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{insight.trend.percentage}%</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-center pt-4 border-t">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>View Detailed Analytics</span>
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No insights available"
              description="Insights will appear here as you collect more feedback data and user interactions."
            />
          )}
        </CardContent>
      </Card>
    </DashboardErrorBoundary>
  );
};
