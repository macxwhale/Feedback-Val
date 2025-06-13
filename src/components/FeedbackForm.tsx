
import React, { useEffect, useState } from 'react';
import { WelcomeScreen } from './feedback/WelcomeScreen';
import { EnhancedLoading } from './feedback/EnhancedLoading';
import { FeedbackContainer } from './feedback/FeedbackContainer';
import { FeedbackContent } from './feedback/FeedbackContent';
import { FeedbackModals } from './feedback/FeedbackModals';
import { FeedbackErrorBoundary } from './feedback/FeedbackErrorBoundary';
import { useFeedbackForm } from '@/hooks/useFeedbackForm';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePrivacyConsent } from '@/hooks/usePrivacyConsent';
import { useSaveContinue } from '@/hooks/useSaveContinue';
import { useOrganizationContext } from '@/context/OrganizationContext';

export interface QuestionConfig {
  id: string;
  type: 'star' | 'nps' | 'likert' | 'single-choice' | 'multi-choice' | 'text' | 'emoji' | 'ranking' | 'matrix' | 'slider';
  question: string;
  required: boolean;
  category: 'QualityCommunication' | 'QualityStaff' | 'ValueForMoney' | 'QualityService' | 'LikeliRecommend' | 'DidWeMakeEasy' | 'Comments';
  options?: string[];
  scale?: {
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
  };
}

export interface FeedbackResponse {
  questionId: string;
  value: any;
  score: number;
  category: string;
}

const FeedbackForm = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { organization, isLoading: orgLoading, error: orgError } = useOrganizationContext();
  
  const {
    questions,
    currentQuestionIndex,
    responses,
    isComplete,
    finalResponses,
    isLoading,
    completedQuestions,
    handleResponse,
    isCurrentQuestionAnswered,
    goToNext,
    goToPrevious,
    resetForm,
    getValidationResult
  } = useFeedbackForm();

  const {
    trackQuestionStart,
    trackQuestionResponse,
    getAverageResponseTime,
    getEstimatedTimeRemaining
  } = useAnalytics(responses, questions.length, finalResponses);

  const { hasConsented, showPrivacyNotice, acceptPrivacy } = usePrivacyConsent();
  const { saveProgress, pauseAndExit, hasUnsavedChanges } = useSaveContinue(
    responses,
    currentQuestionIndex,
    completedQuestions
  );

  useEffect(() => {
    if (!showWelcome) {
      trackQuestionStart();
    }
  }, [currentQuestionIndex, trackQuestionStart, showWelcome]);

  const handleQuestionResponse = (questionId: string, value: any) => {
    handleResponse(questionId, value);
    trackQuestionResponse();
  };

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleReset = () => {
    resetForm();
    setShowWelcome(true);
  };

  // Error boundary check
  const errorBoundary = (
    <FeedbackErrorBoundary 
      orgLoading={orgLoading}
      orgError={orgError}
      organization={organization}
    />
  );
  
  if (errorBoundary) return errorBoundary;

  if (isLoading) {
    return <EnhancedLoading />;
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <FeedbackContainer>
      <FeedbackContent
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        responses={responses}
        completedQuestions={completedQuestions}
        hasConsented={hasConsented}
        canGoNext={isCurrentQuestionAnswered()}
        estimatedTimeRemaining={getEstimatedTimeRemaining(currentQuestionIndex)}
        averageResponseTime={getAverageResponseTime()}
        hasUnsavedChanges={hasUnsavedChanges}
        onQuestionResponse={handleQuestionResponse}
        onNext={goToNext}
        onPrevious={goToPrevious}
        onSaveProgress={saveProgress}
        onPauseAndExit={pauseAndExit}
        getValidationResult={getValidationResult}
      />

      <FeedbackModals
        showPrivacyNotice={showPrivacyNotice}
        isComplete={isComplete}
        finalResponses={finalResponses}
        questions={questions}
        onAcceptPrivacy={acceptPrivacy}
        onReset={handleReset}
      />
    </FeedbackContainer>
  );
};

export default FeedbackForm;
