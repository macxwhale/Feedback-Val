
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QuestionAnalytics {
  id: string;
  question_text: string;
  question_type: string;
  category: string;
  total_responses: number;
  avg_score: number;
  completion_rate: number;
  response_distribution: Record<string, number>;
}

export interface CategoryAnalytics {
  category: string;
  total_questions: number;
  total_responses: number;
  avg_score: number;
  completion_rate: number;
  questions: QuestionAnalytics[];
}

export interface AnalyticsTableData {
  questions: QuestionAnalytics[];
  categories: CategoryAnalytics[];
  summary: {
    total_questions: number;
    total_responses: number;
    overall_avg_score: number;
    overall_completion_rate: number;
  };
}

export const useAnalyticsTableData = (organizationId: string) => {
  return useQuery({
    queryKey: ['analytics-table-data', organizationId],
    queryFn: async (): Promise<AnalyticsTableData> => {
      // Get all questions for the organization
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      // Get all responses for the organization
      const { data: responses } = await supabase
        .from('feedback_responses')
        .select(`
          id,
          question_id,
          response_value,
          score,
          question_category,
          session_id
        `)
        .eq('organization_id', organizationId);

      // Get all sessions for completion rate calculation
      const { data: sessions } = await supabase
        .from('feedback_sessions')
        .select('id, status')
        .eq('organization_id', organizationId);

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
      const overallCompletionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      // Process individual question analytics
      const questionAnalytics: QuestionAnalytics[] = [];
      const categoryMap = new Map<string, CategoryAnalytics>();

      if (questions) {
        for (const question of questions) {
          const questionResponses = responses?.filter(r => r.question_id === question.id) || [];
          const uniqueSessions = new Set(questionResponses.map(r => r.session_id));
          
          // Calculate response distribution based on question type
          const responseDistribution: Record<string, number> = {};
          questionResponses.forEach(response => {
            const value = String(response.response_value);
            responseDistribution[value] = (responseDistribution[value] || 0) + 1;
          });

          // Calculate average score
          const scoresWithValues = questionResponses.filter(r => r.score !== null);
          const avgScore = scoresWithValues.length > 0
            ? scoresWithValues.reduce((sum, r) => sum + r.score, 0) / scoresWithValues.length
            : 0;

          // Calculate completion rate for this question
          const questionCompletionRate = totalSessions > 0 
            ? (uniqueSessions.size / totalSessions) * 100 
            : 0;

          const questionAnalytic: QuestionAnalytics = {
            id: question.id,
            question_text: question.question_text,
            question_type: question.question_type || 'text',
            category: question.category || 'General',
            total_responses: questionResponses.length,
            avg_score: Math.round(avgScore * 10) / 10,
            completion_rate: Math.round(questionCompletionRate),
            response_distribution: responseDistribution
          };

          questionAnalytics.push(questionAnalytic);

          // Update category analytics
          const categoryKey = question.category || 'General';
          if (!categoryMap.has(categoryKey)) {
            categoryMap.set(categoryKey, {
              category: categoryKey,
              total_questions: 0,
              total_responses: 0,
              avg_score: 0,
              completion_rate: 0,
              questions: []
            });
          }

          const categoryData = categoryMap.get(categoryKey)!;
          categoryData.total_questions += 1;
          categoryData.total_responses += questionResponses.length;
          categoryData.questions.push(questionAnalytic);
        }
      }

      // Calculate category averages
      const categoryAnalytics: CategoryAnalytics[] = [];
      categoryMap.forEach(category => {
        const totalScores = category.questions.reduce((sum, q) => sum + (q.avg_score * q.total_responses), 0);
        const totalResponses = category.questions.reduce((sum, q) => sum + q.total_responses, 0);
        const avgCompletionRate = category.questions.reduce((sum, q) => sum + q.completion_rate, 0) / category.total_questions;

        category.avg_score = totalResponses > 0 ? Math.round((totalScores / totalResponses) * 10) / 10 : 0;
        category.completion_rate = Math.round(avgCompletionRate);
        categoryAnalytics.push(category);
      });

      // Calculate overall summary
      const totalQuestions = questions?.length || 0;
      const totalResponses = responses?.length || 0;
      const overallAvgScore = responses && responses.length > 0
        ? responses.filter(r => r.score !== null).reduce((sum, r) => sum + r.score, 0) / responses.filter(r => r.score !== null).length
        : 0;

      return {
        questions: questionAnalytics,
        categories: categoryAnalytics,
        summary: {
          total_questions: totalQuestions,
          total_responses: totalResponses,
          overall_avg_score: Math.round(overallAvgScore * 10) / 10,
          overall_completion_rate: Math.round(overallCompletionRate)
        }
      };
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
