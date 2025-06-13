
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

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

  // Calculate sentiment scores based on ratings
  const calculateSentiment = (score: number) => {
    if (score >= 4) return 'positive';
    if (score <= 2) return 'negative';
    return 'neutral';
  };

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
  const sentimentStats = questionSentiments.reduce((acc, q) => {
    acc[q.sentiment] += 1;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  const totalQuestions = questionSentiments.length;
  const overallSentiment = sentimentStats.positive > sentimentStats.negative ? 'positive' : 
    sentimentStats.negative > sentimentStats.positive ? 'negative' : 'neutral';

  // Category sentiment analysis
  const categorySentiments = analyticsData.categories.map(category => ({
    ...category,
    sentiment: calculateSentiment(category.avg_score),
    sentimentScore: category.avg_score
  }));

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-5 h-5 text-green-600" />;
      case 'negative': return <Frown className="w-5 h-5 text-red-600" />;
      default: return <Meh className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
        <Badge className={getSentimentColor(overallSentiment)}>
          Overall: {overallSentiment}
        </Badge>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Smile className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Positive</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-green-600">
                {sentimentStats.positive}
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((sentimentStats.positive / totalQuestions) * 100)}% of questions
              </div>
              <Progress 
                value={(sentimentStats.positive / totalQuestions) * 100} 
                className="mt-2 h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Meh className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Neutral</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-yellow-600">
                {sentimentStats.neutral}
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((sentimentStats.neutral / totalQuestions) * 100)}% of questions
              </div>
              <Progress 
                value={(sentimentStats.neutral / totalQuestions) * 100} 
                className="mt-2 h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Frown className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Negative</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-red-600">
                {sentimentStats.negative}
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((sentimentStats.negative / totalQuestions) * 100)}% of questions
              </div>
              <Progress 
                value={(sentimentStats.negative / totalQuestions) * 100} 
                className="mt-2 h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Sentiment Score</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-blue-600">
                {(analyticsData.summary.overall_avg_score || 0).toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-500">
                Overall satisfaction
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="questions">By Question</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionSentiments.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getSentimentIcon(question.sentiment)}
                        <Badge className={getSentimentColor(question.sentiment)}>
                          {question.sentiment}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{question.question_text}</h4>
                      <p className="text-xs text-gray-600">
                        {question.total_responses} responses • {question.completion_rate}% completion
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{question.avg_score}/5</div>
                      {question.sentiment === 'negative' && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-auto mt-1" />
                      )}
                      {question.sentiment === 'positive' && (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySentiments.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getSentimentIcon(category.sentiment)}
                        <Badge className={getSentimentColor(category.sentiment)}>
                          {category.sentiment}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-gray-600">
                        {category.total_questions} questions • {category.total_responses} responses
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{category.avg_score}/5</div>
                      <div className="text-sm text-gray-500">{category.completion_rate}% completion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
