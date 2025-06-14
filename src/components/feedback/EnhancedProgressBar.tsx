
import React from 'react';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { MotivationalProgress } from './MotivationalProgress';
import { CompactProgressBar } from './CompactProgressBar';
import { MobileProgressBar } from './MobileProgressBar';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useDynamicBranding } from '@/hooks/useDynamicBranding';

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
      className="mb-8 p-4 rounded-lg border bg-white/50"
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
      
      <MotivationalProgress
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        completedQuestions={completedQuestions}
      />
      
      <CompactProgressBar
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        completedQuestions={completedQuestions}
      />
    </div>
  );
};
