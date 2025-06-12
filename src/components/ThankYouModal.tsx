import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScoreDisplay } from './feedback/ScoreDisplay';
import { QuestionScores } from './feedback/QuestionScores';
import { TotalScore } from './feedback/TotalScore';
import { ThankYouActions } from './feedback/ThankYouActions';
import { FeedbackResponse, QuestionConfig } from './FeedbackForm';
import { AnalyticsInsights } from './feedback/AnalyticsInsights';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ThankYouModalProps {
  isOpen: boolean;
  responses: FeedbackResponse[];
  questions: QuestionConfig[];
  onClose: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  responses,
  questions,
  onClose
}) => {
  const averageScore = responses.length > 0 
    ? Math.round(responses.reduce((sum, response) => sum + response.score, 0) / responses.length) 
    : 0;

  const { analytics } = useAnalytics({}, questions.length, responses);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-[#1e3a8a]">
            Thank You for Your Feedback!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {analytics && <AnalyticsInsights analytics={analytics} />}
          <ScoreDisplay averageScore={averageScore} />
          <QuestionScores responses={responses} questions={questions} />
          <TotalScore responses={responses} />
          <ThankYouActions onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
