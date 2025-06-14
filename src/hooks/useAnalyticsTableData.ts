
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDashboard } from '@/context/DashboardContext';
import { processAnalyticsData } from '@/services/analyticsProcessor';
import { AnalyticsTableData } from '@/types/analytics';

export const useAnalyticsTableData = (organizationId: string) => {
  const { dateRange } = useDashboard();

  return useQuery({
    queryKey: ['analytics-table-data', organizationId, dateRange],
    queryFn: async (): Promise<AnalyticsTableData> => {
      // Get all questions for the organization
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      // Get all responses for the organization, with date filtering
      let responsesQuery = supabase
        .from('feedback_responses')
        .select(`
          id,
          question_id,
          response_value,
          question_category,
          session_id,
          created_at,
          score
        `)
        .eq('organization_id', organizationId);

      if (dateRange?.from) {
        responsesQuery = responsesQuery.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setDate(toDate.getDate() + 1);
        responsesQuery = responsesQuery.lt('created_at', toDate.toISOString());
      }
      const { data: responses } = await responsesQuery;

      // Get all sessions for completion rate calculation, with date filtering
      let sessionsQuery = supabase
        .from('feedback_sessions')
        .select('id, status, created_at, total_score')
        .eq('organization_id', organizationId);

      if (dateRange?.from) {
        sessionsQuery = sessionsQuery.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setDate(toDate.getDate() + 1);
        sessionsQuery = sessionsQuery.lt('created_at', toDate.toISOString());
      }
      const { data: sessions } = await sessionsQuery;
      
      const processedData = processAnalyticsData(questions, responses, sessions);

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
      const overallCompletionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      // Calculate overall summary
      const totalQuestions = questions?.length || 0;
      const totalResponses = responses?.length || 0;

      return {
        ...processedData,
        summary: {
          total_questions: totalQuestions,
          total_responses: totalResponses,
          overall_completion_rate: Math.round(overallCompletionRate)
        },
      };
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
