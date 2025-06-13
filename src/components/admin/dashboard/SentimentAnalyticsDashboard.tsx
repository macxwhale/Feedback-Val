
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { Brain } from 'lucide-react';
import { SentimentOverviewCards } from './sentiment/SentimentOverviewCards';
import { SentimentQuestionsList } from './sentiment/SentimentQuestionsList';
import { SentimentCategoriesList } from './sentiment/SentimentCategoriesList';
import { 
  calculateSentiment, 
  getSentimentColor, 
  aggregateSentimentStats, 
  calculateOverallSentiment 
} from './sentiment/sentimentUtils';

interface SentimentAnalyticsDashboardProps {
  organizationId: string;
}

export const SentimentAnalyticsDashboard: React.FC<SentimentAnalyticsDashboardProps> = ({
  organizationId
}) => {
  const { data: analyticsData, isLoading } = useAnalyticsTableData(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No sentiment data available</p>
        </CardContent>
      </Card>
    );
  }

  // Analyze sentiment by question
  const questionSentiments = analyticsData.questions.map(question => {
    const sentiment = calculateSentiment(question.avg_score);
    return {
      ...question,
      sentiment,
      sentimentScore: question.avg_score
    };
  });

  // Aggregate sentiment stats
  const sentimentStats = aggregateSentimentStats(questionSentiments);
  const totalQuestions = questionSentiments.length;
  const overallSentiment = calculateOverallSentiment(sentimentStats);

  // Category sentiment analysis
  const categorySentiments = analyticsData.categories.map(category => ({
    ...category,
    sentiment: calculateSentiment(category.avg_score),
    sentimentScore: category.avg_score
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
        <Badge className={getSentimentColor(overallSentiment)}>
          Overall: {overallSentiment}
        </Badge>
      </div>

      {/* Sentiment Overview */}
      <SentimentOverviewCards
        sentimentStats={sentimentStats}
        totalQuestions={totalQuestions}
        overallScore={analyticsData.summary.overall_avg_score || 0}
      />

      {/* Detailed Analysis */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="questions">By Question</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <SentimentQuestionsList questionSentiments={questionSentiments} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <SentimentCategoriesList categorySentiments={categorySentiments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
