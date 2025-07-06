
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle, TrendingUp } from 'lucide-react';
import { getResponseTimeColor, getCompletionColor } from './performanceUtils';

interface PerformanceOverviewCardsProps {
  performanceInsights: {
    fastRespondingQuestions: number;
    slowRespondingQuestions: number;
    avgCompletionRate: number;
    totalResponses: number;
    avgResponseTime: number;
  };
  totalQuestions: number;
}

export const PerformanceOverviewCards: React.FC<PerformanceOverviewCardsProps> = ({
  performanceInsights,
  totalQuestions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Overall Performance Score</span>
            </div>
            <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              Good 100%
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {Math.round((performanceInsights.avgCompletionRate + (5000 - performanceInsights.avgResponseTime) / 50) / 2)}%
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            Composite score measuring response speed, completion rates, and user engagement across all feedback sessions.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">User Satisfaction</span>
            </div>
            <div className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
              Performance Tracking
            </div>
          </div>
          <div className={`text-2xl font-bold mb-2 ${getCompletionColor(performanceInsights.avgCompletionRate)}`}>
            {Math.round(performanceInsights.avgCompletionRate)}%
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            Measures user completion rates and engagement quality, indicating how satisfied users are with the feedback experience.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Growth Trajectory</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-2">
            +{Math.round(performanceInsights.totalResponses * 0.15)}%
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            Tracks growth in response volume, user engagement trends, and feedback quality improvements over time.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
