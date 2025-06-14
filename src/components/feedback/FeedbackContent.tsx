
import React from 'react';
import { EnhancedProgressBar } from './EnhancedProgressBar';
import { EnhancedQuestionRenderer } from './EnhancedQuestionRenderer';
import { NavigationButtons } from './NavigationButtons';
import { KeyboardNavigation } from './KeyboardNavigation';
import { ProgressInsights } from './ProgressInsights';
import { SmartSuggestions } from './SmartSuggestions';
import { DataUsageInfo } from './DataUsageInfo';
import { SaveContinueOptions } from './SaveContinueOptions';
import { ResponsiveContainer } from './ResponsiveContainer';
import { FeedbackHeader } from './FeedbackHeader';
import { OrganizationHeader } from './OrganizationHeader';
import { QuestionConfig } from '../FeedbackForm';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface FeedbackContentProps {
  questions: QuestionConfig[];
  currentQuestionIndex: number;
  responses: Record<string, any>;
  completedQuestions: number[];
  hasConsented: boolean;
  canGoNext: boolean;
  estimatedTimeRemaining: number;
  averageResponseTime: number;
  hasUnsavedChanges: boolean;
  onQuestionResponse: (questionId: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveProgress: () => void;
  onPauseAndExit: () => void;
  getValidationResult: (questionId: string) => any;
}

export const FeedbackContent: React.FC<FeedbackContentProps> = ({
  questions,
  currentQuestionIndex,
  responses,
  completedQuestions,
  hasConsented,
  canGoNext,
  estimatedTimeRemaining,
  averageResponseTime,
  hasUnsavedChanges,
  onQuestionResponse,
  onNext,
  onPrevious,
  onSaveProgress,
  onPauseAndExit,
  getValidationResult
}) => {
  const { isMobile } = useMobileDetection();
  const currentQuestion = questions[currentQuestionIndex];

  if (!hasConsented) {
    return null;
  }

  return (
    <ResponsiveContainer>
      <OrganizationHeader />
      <FeedbackHeader />
      
      <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 ${isMobile ? 'p-4' : 'p-8'}`}>
        <EnhancedProgressBar 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          completedQuestions={completedQuestions}
        />

        <div className="lg:grid lg:grid-cols-3 lg:gap-12 mt-8">
          <main className="lg:col-span-2">
            <EnhancedQuestionRenderer
              question={currentQuestion}
              value={responses[currentQuestion?.id]}
              onChange={(value) => onQuestionResponse(currentQuestion.id, value)}
              validation={getValidationResult(currentQuestion?.id)}
            />
            <div className="mt-8">
              <NavigationButtons
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                canGoNext={canGoNext}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            </div>
          </main>

          {!isMobile && (
            <aside className="lg:col-span-1">
              <div className="space-y-8 sticky top-8">
                <SaveContinueOptions
                  onSave={onSaveProgress}
                  onPause={onPauseAndExit}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
                <ProgressInsights
                  currentIndex={currentQuestionIndex}
                  totalQuestions={questions.length}
                  completedQuestions={completedQuestions}
                  estimatedTimeRemaining={estimatedTimeRemaining}
                  averageResponseTime={averageResponseTime}
                />
                <SmartSuggestions
                  currentQuestion={currentQuestion}
                  responses={responses}
                  onSuggestionClick={(value) => onQuestionResponse(currentQuestion.id, value)}
                />
                <DataUsageInfo />
              </div>
            </aside>
          )}
        </div>
      </div>

      {!isMobile && (
        <KeyboardNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          canGoNext={canGoNext}
          isFirstQuestion={currentQuestionIndex === 0}
        />
      )}
    </ResponsiveContainer>
  );
};
