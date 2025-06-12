
import React from 'react';
import { TrendingUp, Star, Target } from 'lucide-react';

interface MotivationalProgressProps {
  currentIndex: number;
  totalQuestions: number;
  completedQuestions: number[];
}

export const MotivationalProgress: React.FC<MotivationalProgressProps> = ({
  currentIndex,
  totalQuestions,
  completedQuestions
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const completionRate = (completedQuestions.length / totalQuestions) * 100;

  const getMotivationalMessage = () => {
    if (progress < 25) return "Great start! Your feedback matters.";
    if (progress < 50) return "You're doing amazing! Keep going.";
    if (progress < 75) return "Almost there! Your input is valuable.";
    return "Final stretch! Thank you for your time.";
  };

  const getProgressIcon = () => {
    if (progress < 33) return <Target className="h-4 w-4 text-blue-600" />;
    if (progress < 66) return <TrendingUp className="h-4 w-4 text-orange-600" />;
    return <Star className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4 border border-blue-200/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getProgressIcon()}
          <span className="text-sm font-medium text-gray-700">
            {getMotivationalMessage()}
          </span>
        </div>
        <div className="text-sm font-bold text-orange-600">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="relative w-full bg-white/60 rounded-full h-3 overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-green-400/40 rounded-full transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
};
