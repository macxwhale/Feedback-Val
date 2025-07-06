
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
  BarChart3,
  Lightbulb,
  Target
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
        <div className="p-4 bg-white/95 backdrop-blur-sm border rounded-xl shadow-xl ring-1 ring-black/5">
          <p className="text-sm text-gray-700 max-w-[200px] break-words font-medium">{label}</p>
          <p className="font-bold text-orange-600 text-lg">{`${payload[0].value}% completion`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="bg-gradient-to-br from-white via-gray-50/50 to-slate-50/30 backdrop-blur-sm border-2 border-gray-100/50 shadow-xl">
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Customer Insights Available</h3>
          <p className="text-gray-500">Start collecting feedback to see detailed customer insights</p>
        </CardContent>
      </Card>
    );
  }

  // Enhanced calculations with better clarity
  const completionRates = analyticsData.questions.map(q => q.completion_rate);
  const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
  
  const insights = analyticsData.questions.reduce((acc, question) => {
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
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-yellow-50/40 backdrop-blur-sm rounded-xl border-2 border-orange-100/50 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Insights</h2>
            <p className="text-gray-600 font-medium">Deep analysis of customer feedback patterns</p>
          </div>
        </div>
        <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold">
          {analyticsData.summary.total_responses.toLocaleString()} responses analyzed
        </Badge>
      </div>

      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Avg Completion</span>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-green-700">{Math.round(avgCompletionRate)}%</div>
              <Progress value={avgCompletionRate} className="h-2" />
              <p className="text-xs text-gray-600 font-medium">Overall performance metric</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">High Performers</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-700">{insights.highPerforming.length}</div>
              <div className="text-sm text-gray-600 font-medium">questions ≥ 90% completion</div>
              <div className="text-xs text-blue-600 font-semibold">
                {Math.round((insights.highPerforming.length / analyticsData.questions.length) * 100)}% of total
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50/80 to-pink-50/60 backdrop-blur-sm border-2 border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500 rounded-lg shadow-sm">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Need Attention</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-700">{insights.needAttention.length}</div>
              <div className="text-sm text-gray-600 font-medium">questions &lt; 70% completion</div>
              <div className="text-xs text-red-600 font-semibold">
                Requires immediate review
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 backdrop-blur-sm border-2 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Optimization</span>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-amber-700">{insights.lowCompletion.length}</div>
              <div className="text-sm text-gray-600 font-medium">questions &lt; 80% completion</div>
              <div className="text-xs text-amber-600 font-semibold">
                Improvement opportunities
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Detailed Analysis */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-100/50">
          <TabsTrigger value="trends" className="font-semibold">Performance Trends</TabsTrigger>
          <TabsTrigger value="themes" className="font-semibold">Key Themes</TabsTrigger>
          <TabsTrigger value="sessions" className="font-semibold">Session Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6 mt-8">
          <Card className="bg-gradient-to-br from-white via-gray-50/30 to-slate-50/20 backdrop-blur-sm border-2 border-gray-100/50 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-500 rounded-lg shadow-sm">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Feedback Performance Trends</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.categories.map((category, index) => (
                  <div key={index} className="p-6 bg-gradient-to-r from-gray-50/80 to-slate-50/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 text-lg">{category.category}</h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {category.total_questions} questions • {category.total_responses.toLocaleString()} responses
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-gray-900">{category.completion_rate}%</div>
                        <div className="text-sm text-gray-500 font-medium">completion rate</div>
                      </div>
                    </div>
                    <Progress value={category.completion_rate} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm border-2 border-green-200/50 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-green-700 text-xl">High Performing Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.highPerforming.slice(0, 5).map((question, index) => (
                    <div key={index} className="p-4 bg-green-50/80 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
                      <div className="font-semibold text-sm text-gray-900 mb-2 leading-relaxed">{question.question_text}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">{question.total_responses.toLocaleString()} responses</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                          {question.completion_rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {insights.highPerforming.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No high performing questions yet</p>
                      <p className="text-sm">Questions with ≥90% completion will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50/80 to-pink-50/60 backdrop-blur-sm border-2 border-red-200/50 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500 rounded-lg shadow-sm">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-red-700 text-xl">Questions Needing Attention</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.needAttention.slice(0, 5).map((question, index) => (
                    <div key={index} className="p-4 bg-red-50/80 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
                      <div className="font-semibold text-sm text-gray-900 mb-2 leading-relaxed">{question.question_text}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">{question.total_responses.toLocaleString()} responses</span>
                        <Badge variant="secondary" className="bg-red-100 text-red-800 font-bold">
                          {question.completion_rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {insights.needAttention.length === 0 && (
                    <div className="text-center py-8 text-green-600">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                      <p className="font-bold">All questions performing well!</p>
                      <p className="text-sm">No questions below 70% completion rate</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6 mt-8">
          <Card className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 backdrop-blur-sm border-2 border-blue-100/50 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Session Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-bold mb-6 text-gray-900 text-lg">Completion Rate by Question</h4>
                  <div className="h-[300px] bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analyticsData.questions.slice(0, 5).map(q => ({ 
                          name: q.question_text, 
                          'Completion Rate': q.completion_rate 
                        }))}
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
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }} />
                        <Bar 
                          dataKey="Completion Rate" 
                          fill="url(#completionGradient)" 
                          barSize={20} 
                          radius={[0, 4, 4, 0]} 
                        />
                        <defs>
                          <linearGradient id="completionGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-6 text-gray-900 text-lg">Response Distribution</h4>
                  <div className="space-y-4">
                    {analyticsData.categories.map((category, index) => (
                      <div key={index} className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-900">{category.category}</span>
                          <span className="text-sm font-bold text-gray-900">{category.total_responses.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress 
                            value={(category.total_responses / analyticsData.summary.total_responses) * 100} 
                            className="flex-1 h-3" 
                          />
                          <span className="text-xs font-bold text-gray-600 min-w-[3rem] text-right">
                            {Math.round((category.total_responses / analyticsData.summary.total_responses) * 100)}%
                          </span>
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
