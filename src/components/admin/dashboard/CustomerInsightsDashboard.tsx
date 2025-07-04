
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface CustomerInsightsDashboardProps {
  organizationId: string;
}

export const CustomerInsightsDashboard: React.FC<CustomerInsightsDashboardProps> = ({
  organizationId
}) => {
  const { data: analyticsData, isLoading } = useAnalyticsTableData(organizationId);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground max-w-[200px] break-words">{label}</p>
          <p className="font-bold text-foreground">{`${payload[0].value}% completion`}</p>
        </div>
      );
    }
    return null;
  };

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
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No customer insights data available</p>
        </CardContent>
      </Card>
    );
  }

  // CALCULATION EXPLANATIONS (For user's clarity)
  /*
    Avg Completion Rate: 
      (Sum of all question completion rates) / number of questions

    High Performers:
      Questions with completion_rate >= 90% 
      (Threshold, adjustable by user).

    Need Attention:
      Questions with completion_rate < 70%.

    Low Completion:
      completion_rate < 80%
  */
  const completionRates = analyticsData.questions.map(q => q.completion_rate);
  const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
  
  const themes = analyticsData.questions.reduce((acc, question) => {
    if (question.completion_rate < 80) {
      acc.lowCompletion.push(question);
    } else if (question.completion_rate >= 90) {
      acc.highPerforming.push(question);
    }
    if (question.completion_rate < 70) {
      acc.needAttention.push(question);
    }
    return acc;
  }, {
    highPerforming: [] as any[],
    needAttention: [] as any[],
    lowCompletion: [] as any[]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Insights</h2>
        <Badge variant="outline">
          {analyticsData.summary.total_responses} total responses
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Avg Completion Rate</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{Math.round(avgCompletionRate)}%</div>
              <Progress value={avgCompletionRate} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">High Performers</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{themes.highPerforming.length}</div>
              <div className="text-sm text-gray-500">questions ≥ 90% completion</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Need Attention</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{themes.needAttention.length}</div>
              <div className="text-sm text-gray-500">questions &lt; 70% completion</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Low Completion</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{themes.lowCompletion.length}</div>
              <div className="text-sm text-gray-500">questions &lt; 80% completion</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <p className="text-sm text-gray-600">
                        {category.total_questions} questions • {category.total_responses} responses
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{category.completion_rate}% completion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">High Performing Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {themes.highPerforming.slice(0, 5).map((question, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div className="font-medium text-sm">{question.question_text}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{question.total_responses} responses</span>
                      </div>
                    </div>
                  ))}
                  {themes.highPerforming.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No high performing questions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Questions Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {themes.needAttention.slice(0, 5).map((question, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="font-medium text-sm">{question.question_text}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{question.total_responses} responses</span>
                      </div>
                    </div>
                  ))}
                  {themes.needAttention.length === 0 && (
                    <p className="text-gray-500 text-center py-4">All questions performing well!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-medium mb-3">Completion Rate by Question</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analyticsData.questions.slice(0, 5).map(q => ({ name: q.question_text, 'Completion Rate': q.completion_rate }))}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} unit="%" />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={60}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                        <Bar dataKey="Completion Rate" fill="hsl(var(--primary))" barSize={20} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Response Distribution</h4>
                  <div className="space-y-2">
                    {analyticsData.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{category.category}</span>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(category.total_responses / analyticsData.summary.total_responses) * 100} 
                            className="w-16 h-2" 
                          />
                          <span className="text-sm font-medium">{category.total_responses}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
