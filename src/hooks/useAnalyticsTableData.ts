
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsTableData } from '@/types/analytics';
import { 
  calculateSessionMetrics,
  calculateGrowthMetrics,
  processQuestionsAnalytics,
  processCategoriesAnalytics,
  generateTrendData
} from '@/utils/analyticsCalculations';

export const useAnalyticsTableData = (organizationId: string) => {
  return useQuery({
    queryKey: ['analytics-table-data', organizationId],
    queryFn: async (): Promise<AnalyticsTableData> => {
      console.log('Fetching analytics data for organization:', organizationId);

      // Fetch questions with analytics data
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          question_type,
          category,
          is_active,
          created_at
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      // Fetch responses data with proper filtering
      const { data: responsesData, error: responsesError } = await supabase
        .from('feedback_responses')
        .select(`
          id,
          question_id,
          score,
          response_time_ms,
          created_at,
          question_category,
          session_id,
          response_value
        `)
        .eq('organization_id', organizationId);

      if (responsesError) {
        console.error('Error fetching responses:', responsesError);
        throw responsesError;
      }

      // Fetch sessions data for comprehensive analytics
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('feedback_sessions')
        .select(`
          id,
          status,
          total_score,
          created_at,
          completed_at,
          started_at,
          user_id
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      console.log('Raw data fetched:', {
        questions: questionsData?.length || 0,
        responses: responsesData?.length || 0,
        sessions: sessionsData?.length || 0
      });

      // Calculate session metrics
      const sessionMetrics = calculateSessionMetrics(sessionsData || []);
      const growthRate = calculateGrowthMetrics(sessionMetrics.cleanedSessions);

      // Process questions analytics
      const questions = processQuestionsAnalytics(
        questionsData || [], 
        responsesData || [], 
        sessionMetrics.totalSessions
      );

      // Process categories analytics
      const categories = processCategoriesAnalytics(questions);

      // Generate trend data
      const trendData = generateTrendData(sessionMetrics.cleanedSessions);

      const analyticsResult = {
        questions,
        categories,
        summary: {
          total_questions: questions.length,
          total_responses: questions.reduce((sum, q) => sum + q.total_responses, 0),
          overall_completion_rate: sessionMetrics.completionRate,
          total_sessions: sessionMetrics.totalSessions,
          completed_sessions: sessionMetrics.completedSessions,
          avg_score: Math.round(sessionMetrics.avgSessionScore * 100) / 100,
          user_satisfaction_rate: sessionMetrics.userSatisfactionRate,
          growth_rate: growthRate,
          abandoned_sessions: sessionMetrics.abandonedSessions,
          response_rate: questions.length > 0 && sessionMetrics.totalSessions > 0
            ? Math.round((questions.reduce((sum, q) => sum + q.total_responses, 0) / (questions.length * sessionMetrics.totalSessions)) * 100)
            : 0
        },
        trendData
      };

      console.log('Analytics result with safe calculations:', analyticsResult);
      return analyticsResult;
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};
