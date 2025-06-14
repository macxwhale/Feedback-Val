
import React from 'react';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { MobileProgressBar } from './MobileProgressBar';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useDynamicBranding } from '@/hooks/useDynamicBranding';
import { Progress } from '@/components/ui/progress';

interface EnhancedProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  completedQuestions: number[];
}

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestions,
  completedQuestions
}) => {
  const { isMobile } = useMobileDetection();
  const { colors } = useDynamicBranding();
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  if (isMobile) {
    return (
      <MobileProgressBar
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        completedQuestions={completedQuestions}
      />
    );
  }

  return (
    <div 
      className="mb-8 p-6 rounded-2xl border bg-white/50 backdrop-blur-sm"
      style={{ 
        borderColor: `${colors.primary}20`
      }}
      role="progressbar" 
      aria-valuenow={currentQuestionIndex + 1} 
      aria-valuemin={1} 
      aria-valuemax={totalQuestions}
    >
      <BreadcrumbNavigation
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        completedQuestions={completedQuestions}
      />
      
      <div className="flex items-center gap-4 mt-4">
        <span className="text-sm font-medium tabular-nums w-[90px]" style={{ color: colors.textSecondary }}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-sm font-bold tabular-nums w-[40px] text-right" style={{ color: colors.primary }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
