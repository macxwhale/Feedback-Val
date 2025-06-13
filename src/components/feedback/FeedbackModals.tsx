
import React from 'react';
import { PrivacyNotice } from './PrivacyNotice';
import { ThankYouModal } from '../ThankYouModal';
import { SuccessAnimation } from './SuccessAnimation';
import { QuestionConfig, FeedbackResponse } from '../FeedbackForm';

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
  return (
    <>
      <PrivacyNotice
        isVisible={showPrivacyNotice}
        onAccept={onAcceptPrivacy}
      />

      <SuccessAnimation 
        show={isComplete && !finalResponses.length}
        message="Feedback Submitted!"
      />

      <ThankYouModal
        isOpen={isComplete}
        responses={finalResponses}
        questions={questions}
        onClose={onReset}
      />
    </>
  );
};
