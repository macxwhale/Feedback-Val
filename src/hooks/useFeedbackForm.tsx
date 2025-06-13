
import { useState, useEffect, useRef } from 'react';
import { QuestionConfig, FeedbackResponse } from '@/components/FeedbackForm';
import { fetchQuestions } from '@/services/questionsService';
import { useFormNavigation } from './useFormNavigation';
import { useFormResponses } from './useFormResponses';
import { useAutoSave } from './useAutoSave';
import { useFormValidation } from './useFormValidation';
import { useWebhooks } from './useWebhooks';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/hooks/useOrganization';

export const useFeedbackForm = () => {
  const [questions, setQuestions] = useState<QuestionConfig[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResponses, setFinalResponses] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  
  const { organization, isLoading: orgLoading } = useOrganization();
  const { toast } = useToast();
  const { responses, handleResponse, generateFinalResponses, resetResponses, loadResponses } = useFormResponses();
  const { currentQuestionIndex, goToNext, goToPrevious, resetNavigation } = useFormNavigation(questions.length);
  const { validateQuestion, getValidationResult } = useFormValidation();
  
  // Use ref to prevent duplicate loading
  const questionsLoaded = useRef<boolean>(false);
  const lastOrgId = useRef<string | null>(null);
  
  // Auto-save functionality
  const { loadSavedData, clearSavedData } = useAutoSave(
    { responses, currentQuestionIndex, completedQuestions },
    organization ? `feedback-${organization.slug}` : 'feedback-default'
  );

  useEffect(() => {
    const loadQuestions = async () => {
      console.log('useFeedbackForm - Loading questions, org loading:', orgLoading, 'organization:', organization);
      
      // Wait for organization to load
      if (orgLoading) {
        return;
      }

      // Prevent duplicate loading for the same organization
      const currentOrgId = organization?.id || 'fallback';
      if (questionsLoaded.current && lastOrgId.current === currentOrgId) {
        console.log('useFeedbackForm - Questions already loaded for this organization');
        return;
      }

      try {
        setIsLoading(true);
        
        const data = await fetchQuestions(organization?.id);
        console.log('useFeedbackForm - Questions loaded:', data);
        setQuestions(data);
        
        // Mark as loaded for this organization
        questionsLoaded.current = true;
        lastOrgId.current = currentOrgId;
        
        // Load saved data if exists
        const savedData = loadSavedData();
        if (savedData && Object.keys(savedData.responses || {}).length > 0) {
          toast({
            title: "Previous session restored",
            description: "We've restored your previous answers",
          });
          loadResponses(savedData.responses);
          setCompletedQuestions(savedData.completedQuestions || []);
        }
      } catch (error) {
        console.error('useFeedbackForm - Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [organization?.id, orgLoading]); // Only depend on organization ID and loading state

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const response = responses[currentQuestion.id];
    const validation = validateQuestion(currentQuestion, response);
    
    return validation.isValid;
  };

  const handleQuestionResponse = (questionId: string, value: any) => {
    handleResponse(questionId, value);
    
    // Update completed questions
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1 && !completedQuestions.includes(questionIndex)) {
      setCompletedQuestions(prev => [...prev, questionIndex]);
    }
  };

  const submitFeedback = async () => {
    const responsesWithScores = generateFinalResponses();
    setFinalResponses(responsesWithScores);
    setIsComplete(true);
    clearSavedData(); // Clear saved data after successful submission
    
    toast({
      title: "Feedback submitted successfully!",
      description: "Thank you for your valuable input",
    });
    
    console.log('Submitting feedback:', responsesWithScores);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToNext();
    } else {
      submitFeedback();
    }
  };

  const resetForm = () => {
    resetNavigation();
    resetResponses();
    setIsComplete(false);
    setFinalResponses([]);
    setCompletedQuestions([]);
    clearSavedData();
    
    // Reset loading state
    questionsLoaded.current = false;
    lastOrgId.current = null;
  };

  return {
    questions,
    currentQuestionIndex,
    responses,
    isComplete,
    finalResponses,
    isLoading,
    completedQuestions,
    handleResponse: handleQuestionResponse,
    isCurrentQuestionAnswered,
    goToNext: handleNext,
    goToPrevious,
    resetForm,
    getValidationResult
  };
};
