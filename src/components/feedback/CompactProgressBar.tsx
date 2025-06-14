
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompactProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  completedQuestions: number[];
}

export const CompactProgressBar: React.FC<CompactProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  completedQuestions
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600">
          {currentIndex + 1} of {totalQuestions}
        </span>
        {completedQuestions.includes(currentIndex) && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-orange-600">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
