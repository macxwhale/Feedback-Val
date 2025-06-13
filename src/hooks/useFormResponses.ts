
import { useState } from 'react';
import { FeedbackResponse } from '@/components/FeedbackForm';
import { generateRandomScore, storeFeedbackResponses } from '@/services/questionsService';
import { useOrganizationContext } from '@/context/OrganizationContext';
import { useToast } from '@/hooks/use-toast';

export const useFormResponses = () => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useOrganizationContext();
  const { toast } = useToast();

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

  const submitResponses = async (questions: any[]) => {
    if (!organization?.id) {
      throw new Error('Organization not found');
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting responses to database:', responses);
      const session = await storeFeedbackResponses(responses, organization.id, questions);
      
      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your valuable input",
      });

      console.log('Feedback stored with session ID:', session.id);
      return session;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetResponses = () => {
    setResponses({});
  };

  return {
    responses,
    isSubmitting,
    handleResponse,
    loadResponses,
    generateFinalResponses,
    submitResponses,
    resetResponses,
    organizationId: organization?.id
  };
};
