
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Hourglass, Target, CheckCircle } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Fast Responses</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {performanceInsights.fastRespondingQuestions}
            </div>
            <div className="text-sm text-gray-500">questions under 5s</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Hourglass className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Slow Responses</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-red-600">
              {performanceInsights.slowRespondingQuestions}
            </div>
            <div className="text-sm text-gray-500">questions over 15s</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Avg Response Time</span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-bold ${getResponseTimeColor(performanceInsights.avgResponseTime)}`}>
              {(performanceInsights.avgResponseTime / 1000).toFixed(1)}s
            </div>
            <div className="text-sm text-gray-500">overall average</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Completion Rate</span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-bold ${getCompletionColor(performanceInsights.avgCompletionRate)}`}>
              {Math.round(performanceInsights.avgCompletionRate)}%
            </div>
            <div className="text-sm text-gray-500">average completion</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
