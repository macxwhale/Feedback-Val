
import { useState } from 'react';
import { FeedbackResponse } from '@/components/FeedbackForm';
import { generateRandomScore } from '@/services/questionsService';

export const useFormResponses = () => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const loadResponses = (savedResponses: Record<string, any>) => {
    setResponses(savedResponses);
  };

  const generateFinalResponses = (): FeedbackResponse[] => {
    return Object.entries(responses).map(([questionId, value]) => ({
      questionId,
      value,
      score: generateRandomScore(),
      category: 'QualityService' // This should be fetched from the question data
    }));
  };

  const resetResponses = () => {
    setResponses({});
  };

  return {
    responses,
    handleResponse,
    loadResponses,
    generateFinalResponses,
    resetResponses
  };
};
