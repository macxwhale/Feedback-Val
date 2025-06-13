
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { 
  BarChart3, 
  FileText, 
  Users, 
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { QuestionsAnalyticsTable } from './QuestionsAnalyticsTable';
import { CategoriesAnalyticsTable } from './CategoriesAnalyticsTable';
import { ResponsesAnalyticsTable } from './ResponsesAnalyticsTable';
import { AnalyticsSummaryCards } from './AnalyticsSummaryCards';

interface AnalyticsTableProps {
  organizationId: string;
}

export const AnalyticsTable: React.FC<AnalyticsTableProps> = ({
  organizationId
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { data: analyticsData, isLoading } = useAnalyticsTableData(organizationId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Reports</h2>
          <p className="text-gray-600">Detailed insights into questions, categories, and responses</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummaryCards summary={analyticsData.summary} />

      {/* Analytics Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Detailed Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="summary" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Questions</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Categories</span>
              </TabsTrigger>
              <TabsTrigger value="responses" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Responses</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.summary.total_questions}
                    </div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.summary.total_responses}
                    </div>
                    <div className="text-sm text-gray-600">Total Responses</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analyticsData.summary.overall_avg_score}/5
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {analyticsData.summary.overall_completion_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <QuestionsAnalyticsTable questions={analyticsData.questions} />
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <CategoriesAnalyticsTable categories={analyticsData.categories} />
            </TabsContent>

            <TabsContent value="responses" className="mt-6">
              <ResponsesAnalyticsTable 
                questions={analyticsData.questions}
                categories={analyticsData.categories}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
