
import React from 'react';
import { DesignText, DesignCard, DesignContainer } from '@/components/ui/design-system';
import { EnhancedProgressBar } from './EnhancedProgressBar';
import { EnhancedQuestionRenderer } from './EnhancedQuestionRenderer';
import { NavigationButtons } from './NavigationButtons';
import { SmartSuggestions } from './SmartSuggestions';
import { QuestionConfig } from '../FeedbackForm';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface EnhancedFeedbackContainerProps {
  questions: QuestionConfig[];
  currentQuestionIndex: number;
  responses: Record<string, any>;
  completedQuestions: number[];
  hasConsented: boolean;
  canGoNext: boolean;
  estimatedTimeRemaining: number;
  averageResponseTime: number;
  onQuestionResponse: (questionId: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  getValidationResult: (questionId: string) => any;
}

export const EnhancedFeedbackContainer: React.FC<EnhancedFeedbackContainerProps> = ({
  questions,
  currentQuestionIndex,
  responses,
  completedQuestions,
  hasConsented,
  canGoNext,
  estimatedTimeRemaining,
  averageResponseTime,
  onQuestionResponse,
  onNext,
  onPrevious,
  getValidationResult
}) => {
  const { isMobile } = useMobileDetection();
  const currentQuestion = questions[currentQuestionIndex];

  if (!hasConsented || !currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <DesignContainer size="md" className="py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <DesignText.Heading1 className="mb-4">
            Share Your Feedback
          </DesignText.Heading1>
          <DesignText.Body className="max-w-2xl mx-auto">
            Your insights help us improve. This should take just a few minutes.
          </DesignText.Body>
        </div>

        {/* Main Feedback Card */}
        <DesignCard padding="lg" shadow="lg" className="mb-8 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          {/* Progress Bar */}
          <div className="mb-8">
            <EnhancedProgressBar 
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              completedQuestions={completedQuestions}
              estimatedTimeRemaining={estimatedTimeRemaining}
              averageResponseTime={averageResponseTime}
            />
          </div>

          {/* Question Content */}
          <div className="mb-8">
            <EnhancedQuestionRenderer
              question={currentQuestion}
              value={responses[currentQuestion.id]}
              onChange={(value) => onQuestionResponse(currentQuestion.id, value)}
              validation={getValidationResult(currentQuestion.id)}
            />
          </div>

          {/* Smart Suggestions */}
          {!isMobile && (
            <div className="mb-8">
              <SmartSuggestions
                currentQuestion={currentQuestion}
                responses={responses}
                onSuggestionClick={(value) => onQuestionResponse(currentQuestion.id, value)}
              />
            </div>
          )}

          {/* Navigation */}
          <NavigationButtons
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            canGoNext={canGoNext}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </DesignCard>

        {/* Progress Indicator */}
        <div className="text-center">
          <DesignText.Caption>
            Question {currentQuestionIndex + 1} of {questions.length}
          </DesignText.Caption>
        </div>
      </DesignContainer>
    </div>
  );
};
