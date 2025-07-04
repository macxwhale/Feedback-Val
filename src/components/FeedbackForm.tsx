
import React, { useState, useRef } from 'react';
import { FeedbackContent } from './feedback/FeedbackContent';
import { EnhancedFeedbackContainer } from './feedback/EnhancedFeedbackContainer';
import { WelcomeScreen } from './feedback/WelcomeScreen';
import { EnhancedThankYouModal } from './feedback/EnhancedThankYouModal';
import { EnhancedLoading } from './feedback/EnhancedLoading';
import { FeedbackErrorBoundary } from './feedback/FeedbackErrorBoundary';
import { useFeedbackForm } from '@/hooks/useFeedbackForm';
import { PrivacyNotice } from './feedback/PrivacyNotice';
import { usePrivacyConsent } from '@/hooks/usePrivacyConsent';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useOrganization } from '@/hooks/useOrganization';

export interface QuestionConfig {
  id: string;
  question: string;
  type: 'star' | 'nps' | 'likert' | 'text' | 'single-choice' | 'multi-choice' | 'emoji' | 'ranking' | 'matrix' | 'slider';
  required: boolean;
  category?: string;
  options?: string[];
  scale?: {
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
    step?: number;
  };
}

export interface FeedbackResponse {
  questionId: string;
  value: any;
  score?: number;
  category?: string;
}

const FeedbackForm: React.FC = () => {
  const { isMobile } = useMobileDetection();
  const [showWelcome, setShowWelcome] = useState(true);
  const { hasConsented, acceptPrivacy } = usePrivacyConsent();
  const { organization, isLoading: orgLoading, error: orgError } = useOrganization();
  
  const {
    questions,
    currentQuestionIndex,
    responses,
    isComplete,
    finalResponses,
    isLoading,
    questionsError,
    completedQuestions,
    handleResponse,
    isCurrentQuestionAnswered,
    goToNext,
    goToPrevious,
    resetForm,
    getValidationResult
  } = useFeedbackForm();

  if (isLoading) {
    return <EnhancedLoading />;
  }

  if (questionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FeedbackErrorBoundary
          orgLoading={orgLoading}
          orgError={questionsError}
          organization={organization}
        />
      </div>
    );
  }

  if (isComplete) {
    return (
      <EnhancedThankYouModal
        isOpen={isComplete}
        responses={finalResponses}
        questions={questions}
        onReset={resetForm}
      />
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen
        onStart={() => setShowWelcome(false)}
      />
    );
  }

  if (!hasConsented) {
    return <PrivacyNotice isVisible={true} onAccept={acceptPrivacy} />;
  }

  return (
    <div>
      <FeedbackErrorBoundary
        orgLoading={orgLoading}
        orgError={orgError}
        organization={organization}
      />
      <EnhancedFeedbackContainer
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        responses={responses}
        completedQuestions={completedQuestions}
        hasConsented={hasConsented}
        canGoNext={isCurrentQuestionAnswered()}
        estimatedTimeRemaining={Math.ceil((questions.length - currentQuestionIndex) * 30 / 60)}
        averageResponseTime={30}
        onQuestionResponse={handleResponse}
        onNext={goToNext}
        onPrevious={goToPrevious}
        getValidationResult={getValidationResult}
      />
    </div>
  );
};

export default FeedbackForm;
