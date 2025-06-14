
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  Eye,
  BarChart3
} from 'lucide-react';
import type { QuestionAnalytics } from '@/types/analytics';

interface QuestionsAnalyticsTableProps {
  questions: QuestionAnalytics[];
}

export const QuestionsAnalyticsTable: React.FC<QuestionsAnalyticsTableProps> = ({ questions }) => {
  const [sortField, setSortField] = useState<keyof QuestionAnalytics>('total_responses');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const handleSort = (field: keyof QuestionAnalytics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const getQuestionTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'text': 'bg-blue-100 text-blue-800',
      'multiple_choice': 'bg-green-100 text-green-800',
      'scale': 'bg-purple-100 text-purple-800',
      'rating': 'bg-yellow-100 text-yellow-800',
      'nps': 'bg-orange-100 text-orange-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const SortButton = ({ field, children }: { field: keyof QuestionAnalytics; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
      )}
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Individual Questions Analysis</h3>
        <Badge variant="outline">{questions.length} questions</Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <SortButton field="question_text">Question</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="question_type">Type</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="category">Category</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="total_responses">Responses</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="completion_rate">Completion Rate</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="trend">Trend</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.map((question) => (
              <React.Fragment key={question.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedQuestion(
                        expandedQuestion === question.id ? null : question.id
                      )}
                    >
                      {expandedQuestion === question.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={question.question_text}>
                      {question.question_text}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getQuestionTypeColor(question.question_type)}>
                      {question.question_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {question.total_responses}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="font-medium">{question.completion_rate}%</span>
                      <div className="w-12">
                        <Progress value={question.completion_rate} className="h-2" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={question.trend === 'positive' ? 'default' : question.trend === 'negative' ? 'destructive' : 'secondary'}>
                      {question.trend}
                    </Badge>
                  </TableCell>
                </TableRow>
                
                {expandedQuestion === question.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50">
                      <div className="p-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Response Distribution</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {Object.entries(question.response_distribution).map(([value, count]) => (
                              <div key={value} className="p-2 bg-white rounded border">
                                <div className="text-sm font-medium">{value}</div>
                                <div className="text-xs text-gray-600">{count} responses</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Insights</h4>
                          <ul className="text-sm space-y-1">
                            {question.insights.map((insight, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
