
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, AlertTriangle, Target, CheckCircle } from 'lucide-react';
import { getPerformanceColor, getCompletionColor } from './performanceUtils';

interface PerformanceOverviewCardsProps {
  performanceInsights: {
    highPerformingQuestions: number;
    lowPerformingQuestions: number;
    avgCompletionRate: number;
    totalResponses: number;
  };
  avgScore: number;
  totalQuestions: number;
}

export const PerformanceOverviewCards: React.FC<PerformanceOverviewCardsProps> = ({
  performanceInsights,
  avgScore,
  totalQuestions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Top Performers</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {performanceInsights.highPerformingQuestions}
            </div>
            <div className="text-sm text-gray-500">questions scoring 4+</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Need Improvement</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-red-600">
              {performanceInsights.lowPerformingQuestions}
            </div>
            <div className="text-sm text-gray-500">questions scoring below 3</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Avg Score</span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-bold ${getPerformanceColor(avgScore)}`}>
              {avgScore.toFixed(1)}/5
            </div>
            <div className="text-sm text-gray-500">overall rating</div>
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
