
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-600" />
              <span className="text-base font-semibold text-gray-700">Overall Performance Score</span>
            </div>
            <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium">
              Good 100%
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {Math.round((performanceInsights.avgCompletionRate + (5000 - performanceInsights.avgResponseTime) / 50) / 2)}%
          </div>
          <div className="text-sm text-gray-500 leading-relaxed">
            Composite score measuring response speed, completion rates, and user engagement across all feedback sessions.
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-base font-semibold text-gray-700">User Satisfaction</span>
            </div>
          </div>
          <div className={`text-3xl font-bold mb-4 ${getCompletionColor(performanceInsights.avgCompletionRate)}`}>
            {Math.round(performanceInsights.avgCompletionRate)}%
          </div>
          <div className="text-sm text-gray-500 leading-relaxed">
            Measures user completion rates and engagement quality, indicating how satisfied users are with the feedback experience.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
