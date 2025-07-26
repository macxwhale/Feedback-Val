
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedbackService } from '../services/feedbackService';

export const useFeedback = (organizationId: string) => {
  const queryClient = useQueryClient();

  const feedbackQuery = useQuery({
    queryKey: ['feedback-responses', organizationId],
    queryFn: () => FeedbackService.getFeedbackResponses(organizationId),
    enabled: !!organizationId,
  });

  const submitResponseMutation = useMutation({
    mutationFn: FeedbackService.submitResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback-responses', organizationId] });
    },
  });

  return {
    responses: feedbackQuery.data,
    isLoading: feedbackQuery.isLoading,
    error: feedbackQuery.error,
    submitResponse: submitResponseMutation.mutate,
    isSubmitting: submitResponseMutation.isPending,
  };
};
