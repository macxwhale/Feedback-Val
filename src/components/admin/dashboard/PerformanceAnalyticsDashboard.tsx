
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

interface PerformanceAnalyticsDashboardProps {
  organizationId: string;
}

export const PerformanceAnalyticsDashboard: React.FC<PerformanceAnalyticsDashboardProps> = ({
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
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No performance data available</p>
        </CardContent>
      </Card>
    );
  }

  // Analyze question performance
  const topPerformers = analyticsData.questions
    .filter(q => q.avg_score >= 4)
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 5);

  const lowPerformers = analyticsData.questions
    .filter(q => q.avg_score < 3)
    .sort((a, b) => a.avg_score - b.avg_score)
    .slice(0, 5);

  const completionTrends = analyticsData.questions
    .sort((a, b) => b.completion_rate - a.completion_rate);

  // Calculate performance metrics
  const avgScore = analyticsData.summary.avg_score || 0;
  const avgCompletion = analyticsData.questions.reduce((sum, q) => sum + q.completion_rate, 0) / analyticsData.questions.length;
  
  const performanceInsights = {
    highPerformingQuestions: topPerformers.length,
    lowPerformingQuestions: lowPerformers.length,
    avgCompletionRate: avgCompletion,
    totalResponses: analyticsData.summary.total_responses
  };

  // Category performance analysis
  const categoryPerformance = analyticsData.categories
    .sort((a, b) => b.avg_score - a.avg_score);

  const getPerformanceColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <Badge variant="outline">
          {analyticsData.summary.total_questions} questions analyzed
        </Badge>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Top Performers</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-green-600">
                {performanceInsights.highPerformingQuestions}
              </div>
              <div className="text-sm text-gray-500">questions scoring 4+</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Need Improvement</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-red-600">
                {performanceInsights.lowPerformingQuestions}
              </div>
              <div className="text-sm text-gray-500">questions scoring below 3</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Avg Score</span>
            </div>
            <div className="mt-2">
              <div className={`text-2xl font-bold ${getPerformanceColor(avgScore)}`}>
                {avgScore.toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-500">overall rating</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Completion Rate</span>
            </div>
            <div className="mt-2">
              <div className={`text-2xl font-bold ${getCompletionColor(avgCompletion)}`}>
                {Math.round(avgCompletion)}%
              </div>
              <div className="text-sm text-gray-500">average completion</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Analysis */}
      <Tabs defaultValue="top-performers" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
          <TabsTrigger value="low-performers">Need Attention</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="top-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Top Performing Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.length > 0 ? topPerformers.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-green-100 text-green-800">
                          #{index + 1}
                        </Badge>
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-medium text-sm">{question.question_text}</h4>
                      <p className="text-xs text-gray-600">
                        {question.total_responses} responses • {question.completion_rate}% completion
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{question.avg_score}/5</div>
                      <TrendingUp className="w-4 h-4 text-green-500 ml-auto mt-1" />
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">No high performing questions yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Questions Needing Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowPerformers.length > 0 ? lowPerformers.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <Badge className="bg-red-100 text-red-800">
                          Priority
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{question.question_text}</h4>
                      <p className="text-xs text-gray-600">
                        {question.total_responses} responses • {question.completion_rate}% completion
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{question.avg_score}/5</div>
                      <TrendingDown className="w-4 h-4 text-red-500 ml-auto mt-1" />
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">All questions performing well! 🎉</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completionTrends.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm truncate">{question.question_text}</h4>
                      <p className="text-xs text-gray-600">{question.total_responses} responses</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-sm font-bold ${getCompletionColor(question.completion_rate)}`}>
                          {question.completion_rate}%
                        </div>
                      </div>
                      <Progress 
                        value={question.completion_rate} 
                        className="w-20 h-2" 
                      />
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
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformance.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-gray-600">
                        {category.total_questions} questions • {category.total_responses} responses
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getPerformanceColor(category.avg_score)}`}>
                        {category.avg_score}/5
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.completion_rate}% completion
                      </div>
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
