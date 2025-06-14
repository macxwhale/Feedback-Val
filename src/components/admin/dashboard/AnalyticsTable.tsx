import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { QuestionDrillDown } from './QuestionDrillDown';
import { ChevronRight, BarChart3, List } from 'lucide-react';
import type { QuestionAnalytics, CategoryAnalytics } from '@/hooks/useAnalyticsTableData';

interface AnalyticsTableProps {
  questions: QuestionAnalytics[];
  categories: CategoryAnalytics[];
  summary: {
    total_questions: number;
    total_responses: number;
    overall_avg_score: number;
    overall_completion_rate: number;
  };
  showDrillDown?: boolean;
}

export const AnalyticsTable: React.FC<AnalyticsTableProps> = ({
  questions,
  categories,
  summary,
  showDrillDown = false
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const getScoreColor = (score: number): string => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionColor = (rate: number): string => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Mock drill-down data generator
  const generateMockResponses = (questionId: string, totalResponses: number) => {
    return Array.from({ length: Math.min(totalResponses, 10) }, (_, index) => ({
      id: `response-${questionId}-${index}`,
      responseValue: `Response ${index + 1}`,
      score: Math.floor(Math.random() * 5) + 1,
      isSatisfactory: Math.random() > 0.3,
      selectedOption: ['Product A', 'Product B', 'Product C', 'Other'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const analyzeSatisfaction = (question: QuestionAnalytics) => {
    // Example logic: Category-based satisfaction; can be expanded based on rules.
    if (question.category.toLowerCase().includes('support') && question.avg_score >= 4) {
      return "Satisfactory";
    }
    if (question.completion_rate >= 90) {
      return "Satisfactory";
    }
    if (question.completion_rate < 70) {
      return "Low Completion";
    }
    return "Needs Review";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Analytics Dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="questions" className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>Questions</span>
            </TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="questions">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Responses</TableHead>
                    {/* Removed Avg Score */}
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    {showDrillDown && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <React.Fragment key={question.id}>
                      <TableRow>
                        <TableCell className="font-medium max-w-xs truncate">
                          {question.question_text}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{question.question_type}</Badge>
                        </TableCell>
                        <TableCell>{question.category}</TableCell>
                        <TableCell>{question.total_responses}</TableCell>
                        {/* Remove Avg Score */}
                        <TableCell>
                          {question.completion_rate}%
                        </TableCell>
                        <TableCell>
                          {analyzeSatisfaction(question)}
                        </TableCell>
                        {showDrillDown && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedQuestion(
                                selectedQuestion === question.id ? null : question.id
                              )}
                            >
                              <ChevronRight className={`w-4 h-4 transition-transform ${
                                selectedQuestion === question.id ? 'rotate-90' : ''
                              }`} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                      {showDrillDown && selectedQuestion === question.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4 bg-gray-50">
                              <QuestionDrillDown
                                questionId={question.id}
                                questionText={question.question_text}
                                questionType={question.question_type}
                                responses={generateMockResponses(question.id, question.total_responses)}
                                avgScore={question.avg_score}
                                completionRate={question.completion_rate}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="categories">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Total Responses</TableHead>
                  {/* Removed Avg Score */}
                  <TableHead>Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{category.category}</TableCell>
                    <TableCell>{category.total_questions}</TableCell>
                    <TableCell>{category.total_responses}</TableCell>
                    {/* Remove Avg Score */}
                    <TableCell>{category.completion_rate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
