
import React from 'react';
import { BrandedButton } from './BrandedButton';
import { MobileNavigationButtons } from './MobileNavigationButtons';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
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
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200/80 animate-fade-in">
      <BrandedButton
        variant="outline"
        size="lg"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="flex items-center gap-2 px-6 py-3"
      >
        <ChevronLeft size={18} />
        Previous
      </BrandedButton>

      <BrandedButton
        size="lg"
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2 px-8 py-3"
      >
        {isLastQuestion ? 'Submit Feedback' : 'Next Question'}
        {isLastQuestion ? <Send size={18} /> : <ChevronRight size={18} />}
      </BrandedButton>
    </div>
  );
};
