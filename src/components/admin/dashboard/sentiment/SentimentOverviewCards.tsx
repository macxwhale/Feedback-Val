import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Smile, Meh, Frown } from 'lucide-react';

interface SentimentOverviewCardsProps {
  sentimentStats: {
    positive: number;
    neutral: number;
    negative: number;
  };
  totalQuestions: number;
  overallScore: number;
}

export const SentimentOverviewCards: React.FC<SentimentOverviewCardsProps> = ({
  sentimentStats,
  totalQuestions,
  overallScore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Smile className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Positive</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {sentimentStats.positive}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((sentimentStats.positive / totalQuestions) * 100)}% of questions
            </div>
            <Progress 
              value={(sentimentStats.positive / totalQuestions) * 100} 
              className="mt-2 h-2" 
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Meh className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Neutral</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-yellow-600">
              {sentimentStats.neutral}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((sentimentStats.neutral / totalQuestions) * 100)}% of questions
            </div>
            <Progress 
              value={(sentimentStats.neutral / totalQuestions) * 100} 
              className="mt-2 h-2" 
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Frown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Negative</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-red-600">
              {sentimentStats.negative}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((sentimentStats.negative / totalQuestions) * 100)}% of questions
            </div>
            <Progress 
              value={(sentimentStats.negative / totalQuestions) * 100} 
              className="mt-2 h-2" 
            />
          </div>
        </CardContent>
      </Card>
      {/* Removed overallScore/score display card */}
    </div>
  );
};
