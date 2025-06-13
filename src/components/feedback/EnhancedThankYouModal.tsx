
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedbackResponse, QuestionConfig } from '../FeedbackForm';
import { TotalScore } from './TotalScore';
import { ScoreDisplay } from './ScoreDisplay';
import { QuestionScores } from './QuestionScores';
import { CategoryScoreDisplay } from './CategoryScoreDisplay';
import { CustomerInsightsDashboard } from './CustomerInsightsDashboard';
import { SentimentTrends } from './SentimentTrends';
import { AnalyticsInsights } from './AnalyticsInsights';
import { AdvancedInsightsDashboard } from './AdvancedInsightsDashboard';
import { AnalyticsData } from '@/services/analyticsService';
import { SuccessAnimation } from './SuccessAnimation';
import { ThankYouActions } from './ThankYouActions';

interface EnhancedThankYouModalProps {
  isOpen: boolean;
  responses: FeedbackResponse[];
  questions: QuestionConfig[];
  analytics?: AnalyticsData;
  onReset: () => void;
}

export const EnhancedThankYouModal: React.FC<EnhancedThankYouModalProps> = ({
  isOpen,
  responses,
  questions,
  analytics,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const averageScore = responses.length > 0 
    ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <SuccessAnimation show={true} />
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#073763] mb-2">
              Thank You for Your Feedback!
            </h2>
            <p className="text-gray-600">
              Your responses help us understand and improve our services. Here are your insights:
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <ScoreDisplay averageScore={averageScore} />
              <TotalScore responses={responses} />
              <CategoryScoreDisplay responses={responses} questions={questions} />
              <QuestionScores responses={responses} questions={questions} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <CustomerInsightsDashboard responses={responses} questions={questions} />
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              <SentimentTrends responses={responses} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {analytics ? (
                <AnalyticsInsights analytics={analytics} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Analytics data not available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-6">
              <AdvancedInsightsDashboard responses={responses} questions={questions} />
            </TabsContent>
          </Tabs>

          <ThankYouActions onClose={onReset} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
