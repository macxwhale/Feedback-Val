import { useState, useEffect } from 'react';
import { fetchQuestions } from '@/services/questionsService';
import { useFormNavigation } from './useFormNavigation';
import { useFormResponses } from './useFormResponses';
import { useAutoSave } from './useAutoSave';
import { useFormValidation } from './useFormValidation';
import { useToast } from '@/components/ui/use-toast';
import { useOrganization } from '@/hooks/useOrganization';
import { useFeedbackFormState } from './useFeedbackFormState';
import { useSessionManagement } from './useSessionManagement';

export const useFeedbackForm = () => {
  const {
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
  } = useFeedbackFormState();

  const { organization, isLoading: orgLoading } = useOrganization();
  const { toast } = useToast();
  const { 
    responses, 
    isSubmitting,
    handleResponse, 
    generateFinalResponses, 
    submitResponses,
    resetResponses, 
    loadResponses 
  } = useFormResponses();
  const { currentQuestionIndex, goToNext, goToPrevious, resetNavigation } = useFormNavigation(questions.length);
  const { validateQuestion, getValidationResult } = useFormValidation();
  const { sessionId, startNewSession, startQuestionTiming, endSession, clearSession } = useSessionManagement();
  
  const { loadSavedData, clearSavedData } = useAutoSave(
    { responses, currentQuestionIndex, completedQuestions },
    organization ? `feedback-${organization.slug}` : 'feedback-default'
  );

  useEffect(() => {
    const loadQuestions = async () => {
      console.log('useFeedbackForm - Loading questions, org loading:', orgLoading, 'organization:', organization);
      
      if (orgLoading) {
        return;
      }

      const currentOrgId = organization?.id || 'fallback';
      if (questionsLoaded.current && lastOrgId.current === currentOrgId) {
        console.log('useFeedbackForm - Questions already loaded for this organization');
        return;
      }

      try {
        setIsLoading(true);
        setQuestionsError(null);
        
        const data = await fetchQuestions(organization?.slug);
        console.log('useFeedbackForm - Questions loaded:', data);
        setQuestions(data);
        
        questionsLoaded.current = true;
        lastOrgId.current = organization?.id || 'fallback';
        
        startNewSession();

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
        setQuestionsError("We couldn't load the survey questions. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [organization?.id, organization?.slug, orgLoading]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionId = questions[currentQuestionIndex].id;
      startQuestionTiming(currentQuestionId);
    }
  }, [currentQuestionIndex, questions]);

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const response = responses[currentQuestion.id];
    const validation = validateQuestion(currentQuestion, response);
    
    return validation.isValid;
  };

  const handleQuestionResponse = (questionId: string, value: any) => {
    handleResponse(questionId, value);
    
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1 && !completedQuestions.includes(questionIndex)) {
      setCompletedQuestions(prev => [...prev, questionIndex]);
    }
  };

  const submitFeedback = async () => {
    try {
      console.log('Submitting feedback to database...');
      
      const timingData = endSession();
      await submitResponses(questions, timingData);
      
      const responsesWithScores = generateFinalResponses();
      setFinalResponses(responsesWithScores);
      setIsComplete(true);
      clearSavedData();
      clearSession();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToNext();
    } else {
      submitFeedback();
    }
  };

  const resetForm = () => {
    clearSession();
    startNewSession();
    
    resetNavigation();
    resetResponses();
    setIsComplete(false);
    setFinalResponses([]);
    setCompletedQuestions([]);
    clearSavedData();
    setQuestionsError(null);
    
    questionsLoaded.current = false;
    lastOrgId.current = null;
  };

  return {
    questions,
    currentQuestionIndex,
    responses,
    isComplete,
    finalResponses,
    isLoading: isLoading || isSubmitting,
    questionsError,
    completedQuestions,
    handleResponse: handleQuestionResponse,
    isCurrentQuestionAnswered,
    goToNext: handleNext,
    goToPrevious,
    resetForm,
    getValidationResult
  };
};
