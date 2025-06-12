
import React from 'react';
import { AnimatedButton } from './AnimatedButton';
import { MobileNavigationButtons } from './MobileNavigationButtons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface NavigationButtonsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = (props) => {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return <MobileNavigationButtons {...props} />;
  }

  const { currentQuestionIndex, totalQuestions, canGoNext, onPrevious, onNext } = props;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex justify-between items-center animate-fade-in">
      <AnimatedButton
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        icon={ChevronLeft}
        className="border-[#073763] text-[#073763] hover:bg-[#073763] hover:text-white"
      >
        Previous
      </AnimatedButton>

      <AnimatedButton
        onClick={onNext}
        disabled={!canGoNext}
        icon={!isLastQuestion ? ChevronRight : undefined}
        className="bg-gradient-to-r from-[#073763] to-[#007ACE] hover:from-[#062c52] hover:to-[#0066a6] text-white"
      >
        {isLastQuestion ? 'Submit' : 'Next'}
      </AnimatedButton>
    </div>
  );
};
