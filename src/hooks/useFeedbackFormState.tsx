
import { useState, useRef } from 'react';
import { QuestionConfig, FeedbackResponse } from '@/components/FeedbackForm';

export const useFeedbackFormState = () => {
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResponses, setFinalResponses] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  
  const questionsLoaded = useRef<boolean>(false);
  const lastOrgId = useRef<string | null>(null);

  return {
    questions,
    setQuestions,
    isComplete,
    setIsComplete,
    finalResponses,
    setFinalResponses,
    isLoading,
    setIsLoading,
    completedQuestions,
    setCompletedQuestions,
    questionsError,
    setQuestionsError,
    questionsLoaded,
    lastOrgId
  };
};
