
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FeedbackResponse, QuestionConfig } from '../FeedbackForm';

interface CategoryScoreDisplayProps {
  responses: FeedbackResponse[];
  questions: QuestionConfig[];
}

export const CategoryScoreDisplay: React.FC<CategoryScoreDisplayProps> = ({
  responses,
  questions
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const calculateCategoryScores = () => {
    const categories: Record<string, { scores: number[], name: string }> = {};
    
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question && question.category) {
        if (!categories[question.category]) {
          categories[question.category] = { 
            scores: [], 
            name: getCategoryDisplayName(question.category)
          };
        }
        categories[question.category].scores.push(response.score);
      }
    });

    return Object.entries(categories).map(([key, data]) => ({
      category: key,
      name: data.name,
      averageScore: Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length),
      count: data.scores.length
    }));
  };

  const getCategoryDisplayName = (category: string) => {
    const displayNames: Record<string, string> = {
      'QualityCommunication': 'Communication Quality',
      'QualityStaff': 'Staff Quality',
      'ValueForMoney': 'Value for Money',
      'QualityService': 'Service Quality',
      'LikeliRecommend': 'Likelihood to Recommend',
      'DidWeMakeEasy': 'Ease of Business',
      'Comments': 'Additional Comments'
    };
    return displayNames[category] || category;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const categoryScores = calculateCategoryScores();

  if (categoryScores.length === 0) return null;

  const selectedCategoryData = categoryScores.find(cat => cat.category === selectedCategory);

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-[#073763] mb-4">
        Category Breakdown:
      </h4>
      
      {/* Category Selection */}
      <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">
            Select Category to View Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categoryScores.map(({ category, name, averageScore }) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={category} />
                  <Label 
                    htmlFor={category} 
                    className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                  >
                    <span>{name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(averageScore)}`}>
                      {averageScore}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Selected Category Details */}
      {selectedCategoryData && (
        <Card className="border-l-4 border-l-[#007ACE] animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg text-[#073763]">
              {selectedCategoryData.name} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(selectedCategoryData.averageScore).split(' ')[0]}`}>
                  {selectedCategoryData.averageScore}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {selectedCategoryData.count}
                </div>
                <div className="text-sm text-gray-600">
                  Question{selectedCategoryData.count !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryScores.map(({ category, name, averageScore, count }) => (
          <Card key={category} className="border-l-4 border-l-[#007ACE]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                {name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore} points
                </div>
                <div className="text-xs text-gray-500">
                  {count} question{count !== 1 ? 's' : ''}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
