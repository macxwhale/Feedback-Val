
import React from 'react';
import { PrivacyNotice } from './PrivacyNotice';
import { EnhancedThankYouModal } from './EnhancedThankYouModal';
import { FeedbackResponse, QuestionConfig } from '../FeedbackForm';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FeedbackModalsProps {
  showPrivacyNotice: boolean;
  isComplete: boolean;
  finalResponses: FeedbackResponse[];
  questions: QuestionConfig[];
  onAcceptPrivacy: () => void;
  onReset: () => void;
}

export const FeedbackModals: React.FC<FeedbackModalsProps> = ({
  showPrivacyNotice,
  isComplete,
  finalResponses,
  questions,
  onAcceptPrivacy,
  onReset
}) => {
  // Generate analytics for the thank you modal
  const responses = finalResponses.reduce((acc, response) => {
    acc[response.questionId] = response.value;
    return acc;
  }, {} as Record<string, any>);

  const { analytics } = useAnalytics(responses, questions.length, finalResponses);

  return (
    <>
      <PrivacyNotice
        isVisible={showPrivacyNotice}
        onAccept={onAcceptPrivacy}
      />
      
      <EnhancedThankYouModal
        isOpen={isComplete}
        responses={finalResponses}
        questions={questions}
        analytics={analytics}
        onReset={onReset}
      />
    </>
  );
};
