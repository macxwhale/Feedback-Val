
import React, { useEffect, useState } from 'react';
import { FeedbackHeader } from './feedback/FeedbackHeader';
import { WelcomeScreen } from './feedback/WelcomeScreen';
import { EnhancedProgressBar } from './feedback/EnhancedProgressBar';
import { EnhancedQuestionRenderer } from './feedback/EnhancedQuestionRenderer';
import { NavigationButtons } from './feedback/NavigationButtons';
import { KeyboardNavigation } from './feedback/KeyboardNavigation';
import { ThankYouModal } from './ThankYouModal';
import { EnhancedLoading } from './feedback/EnhancedLoading';
import { SuccessAnimation } from './feedback/SuccessAnimation';
import { ResponsiveContainer } from './feedback/ResponsiveContainer';
import { useFeedbackForm } from '@/hooks/useFeedbackForm';
import { ProgressInsights } from './feedback/ProgressInsights';
import { SmartSuggestions } from './feedback/SmartSuggestions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { PrivacyNotice } from './feedback/PrivacyNotice';
import { DataUsageInfo } from './feedback/DataUsageInfo';
import { SaveContinueOptions } from './feedback/SaveContinueOptions';
import { usePrivacyConsent } from '@/hooks/usePrivacyConsent';
import { useSaveContinue } from '@/hooks/useSaveContinue';
import { useMobileDetection } from '@/hooks/useMobileDetection';

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
  const { isMobile } = useMobileDetection();
  
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
    getEstimatedTimeRemaining,
    engagementScore
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

  if (isLoading) {
    return <EnhancedLoading />;
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 ${isMobile ? 'pb-24' : ''}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>
      
      <ResponsiveContainer>
        <FeedbackHeader />
        
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 ${isMobile ? 'p-4' : 'p-8'}`}>
          <PrivacyNotice
            isVisible={showPrivacyNotice}
            onAccept={acceptPrivacy}
          />

          {hasConsented && (
            <>
              <EnhancedProgressBar 
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                completedQuestions={completedQuestions}
              />

              {!isMobile && (
                <>
                  <SaveContinueOptions
                    onSave={saveProgress}
                    onPause={pauseAndExit}
                    hasUnsavedChanges={hasUnsavedChanges}
                  />

                  <ProgressInsights
                    currentIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    completedQuestions={completedQuestions}
                    estimatedTimeRemaining={getEstimatedTimeRemaining(currentQuestionIndex)}
                    averageResponseTime={getAverageResponseTime()}
                  />
                </>
              )}

              <EnhancedQuestionRenderer
                question={currentQuestion}
                value={responses[currentQuestion?.id]}
                onChange={(value) => handleQuestionResponse(currentQuestion.id, value)}
                validation={getValidationResult(currentQuestion?.id)}
              />

              {!isMobile && (
                <SmartSuggestions
                  currentQuestion={currentQuestion}
                  responses={responses}
                  onSuggestionClick={(value) => handleQuestionResponse(currentQuestion.id, value)}
                />
              )}

              <NavigationButtons
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                canGoNext={isCurrentQuestionAnswered()}
                onPrevious={goToPrevious}
                onNext={goToNext}
              />

              {!isMobile && <DataUsageInfo />}
            </>
          )}
        </div>
      </ResponsiveContainer>

      {hasConsented && !isMobile && (
        <KeyboardNavigation
          onNext={goToNext}
          onPrevious={goToPrevious}
          canGoNext={isCurrentQuestionAnswered()}
          isFirstQuestion={currentQuestionIndex === 0}
        />
      )}

      <SuccessAnimation 
        show={isComplete && !finalResponses.length}
        message="Feedback Submitted!"
      />

      <ThankYouModal
        isOpen={isComplete}
        responses={finalResponses}
        questions={questions}
        onClose={handleReset}
      />
    </div>
  );
};

export default FeedbackForm;
