
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
  const { organization, loading: orgLoading, error: orgError } = useOrganization();
  
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
      <FeedbackErrorBoundary
        orgLoading={orgLoading}
        orgError={questionsError}
        organization={organization}
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Unable to Load Survey
            </h2>
            <p className="text-gray-600 mb-6">{questionsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-sunset-500 text-white rounded-lg hover:bg-sunset-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </FeedbackErrorBoundary>
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
    <FeedbackErrorBoundary
      orgLoading={orgLoading}
      orgError={orgError}
      organization={organization}
    >
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
    </FeedbackErrorBoundary>
  );
};

export default FeedbackForm;
