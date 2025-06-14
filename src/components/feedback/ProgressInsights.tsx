import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Star, Target } from 'lucide-react';

interface ProgressInsightsProps {
  currentIndex: number;
  totalQuestions: number;
  completedQuestions: number[];
  estimatedTimeRemaining: number;
  averageResponseTime: number;
}

export const ProgressInsights: React.FC<ProgressInsightsProps> = ({
  currentIndex,
  totalQuestions,
  completedQuestions,
  estimatedTimeRemaining,
  averageResponseTime
}) => {
  const efficiency = averageResponseTime < 30 ? 'fast' : averageResponseTime < 60 ? 'steady' : 'thoughtful';
  
  const getEfficiencyColor = () => {
    switch (efficiency) {
      case 'fast': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'steady': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getEfficiencyIcon = () => {
    switch (efficiency) {
      case 'fast': return <TrendingUp className="h-3 w-3" />;
      case 'steady': return <Target className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50/80 to-orange-50/80 border-blue-200/50 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700 bg-white/60 px-3 py-1 rounded-full">
                Progress Insights
              </span>
            </div>
            <Badge className={`${getEfficiencyColor()} shadow-sm border`}>
              <div className="flex items-center space-x-1">
                {getEfficiencyIcon()}
                <span className="font-medium">{efficiency} responder</span>
              </div>
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="text-center bg-white/40 rounded-xl p-4 backdrop-blur-sm border border-white/30 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Time Remaining</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                ~{estimatedTimeRemaining}s
              </div>
            </div>
            
            <div className="text-center bg-white/40 rounded-xl p-4 backdrop-blur-sm border border-white/30 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Progress</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {currentIndex}/{totalQuestions}
              </div>
            </div>
            
            <div className="text-center bg-white/40 rounded-xl p-4 backdrop-blur-sm border border-white/30 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Star className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Avg Response</span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                {averageResponseTime}s
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
