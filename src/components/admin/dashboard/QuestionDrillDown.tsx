
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart3,
  PieChart
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuestionResponse {
  id: string;
  responseValue: any;
  score: number;
  isSatisfactory: boolean;
  selectedOption?: string;
  createdAt: string;
}

interface QuestionDrillDownProps {
  questionId: string;
  questionText: string;
  questionType: string;
  responses: QuestionResponse[];
  avgScore: number;
  completionRate: number;
}

export const QuestionDrillDown: React.FC<QuestionDrillDownProps> = ({
  questionId,
  questionText,
  questionType,
  responses,
  avgScore,
  completionRate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const satisfactoryResponses = responses.filter(r => r.isSatisfactory);
  const unsatisfactoryResponses = responses.filter(r => !r.isSatisfactory);
  const satisfactionRate = responses.length > 0 ? (satisfactoryResponses.length / responses.length) * 100 : 0;

  // Calculate option distribution for selection-type questions
  const optionDistribution = () => {
    if (!['multiple_choice', 'single_choice', 'product_selection'].includes(questionType)) {
      return null;
    }

    const distribution: Record<string, number> = {};
    responses.forEach(response => {
      const option = response.selectedOption || 'Unknown';
      distribution[option] = (distribution[option] || 0) + 1;
    });

    return Object.entries(distribution).map(([option, count]) => ({
      option,
      count,
      percentage: (count / responses.length) * 100
    }));
  };

  const options = optionDistribution();

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{questionText}</CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline">{questionType}</Badge>
              <span className="text-sm text-gray-600">{responses.length} responses</span>
              <span className="text-sm font-medium">Avg: {avgScore}/5</span>
              <span className="text-sm text-gray-600">{completionRate}% completion</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {/* Satisfaction Analysis */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Response Satisfaction
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Satisfactory</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{satisfactoryResponses.length}</p>
                  <p className="text-sm text-green-700">{Math.round(satisfactionRate)}% of responses</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-900">Needs Attention</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{unsatisfactoryResponses.length}</p>
                  <p className="text-sm text-red-700">{Math.round(100 - satisfactionRate)}% of responses</p>
                </div>
              </div>
            </div>

            {/* Option Distribution for Selection Questions */}
            {options && (
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <PieChart className="w-4 h-4 mr-2" />
                  Selection Distribution
                </h4>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{option.option}</span>
                        <span>{option.count} ({Math.round(option.percentage)}%)</span>
                      </div>
                      <Progress value={option.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Responses Sample */}
            <div>
              <h4 className="font-medium mb-3">Recent Responses Sample</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {responses.slice(0, 5).map((response, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${response.isSatisfactory ? 'text-green-600' : 'text-red-600'}`}>
                        Score: {response.score}/5
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(response.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {response.selectedOption && (
                      <p className="text-gray-600 mt-1">Selected: {response.selectedOption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
