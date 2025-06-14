
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { processResponsesByType } from '@/services/responseDataProcessor';

export interface QuestionAnalytics {
  id: string;
  question_text: string;
  question_type: string;
  category: string;
  total_responses: number;
  completion_rate: number;
  avg_score: number;
  response_distribution: Record<string, number>;
  insights: string[];
  trend: 'positive' | 'neutral' | 'negative' | 'mixed';
}

export interface CategoryAnalytics {
  category: string;
  total_questions: number;
  total_responses: number;
  completion_rate: number;
  questions: QuestionAnalytics[];
  avg_score: number;
}

export interface AnalyticsTableData {
  questions: QuestionAnalytics[];
  categories: CategoryAnalytics[];
  summary: {
    total_questions: number;
    total_responses: number;
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
          question_category,
          session_id,
          created_at,
          score
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
          
          const scoredResponses = questionResponses.filter(r => typeof r.score === 'number');
          const totalScore = scoredResponses.reduce((sum, r) => sum + (r.score as number), 0);
          const avgScore = scoredResponses.length > 0 ? totalScore / scoredResponses.length : 0;

          // Process real response data
          const processedData = processResponsesByType(
            question.question_type || 'text',
            questionResponses,
            totalSessions
          );

          // Determine trend based on question type and responses
          const trend = determineTrend(question.question_type, processedData.distribution, questionResponses.length);

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
            completion_rate: Math.round(questionCompletionRate),
            avg_score: avgScore,
            response_distribution: processedData.distribution,
            insights: processedData.insights,
            trend
          };

          questionAnalytics.push(questionAnalytic);

          // Update category analytics
          const categoryKey = question.category || 'General';
          if (!categoryMap.has(categoryKey)) {
            categoryMap.set(categoryKey, {
              category: categoryKey,
              total_questions: 0,
              total_responses: 0,
              completion_rate: 0,
              questions: [],
              avg_score: 0,
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
        const avgCompletionRate = category.questions.length > 0
          ? category.questions.reduce((sum, q) => sum + q.completion_rate, 0) / category.questions.length
          : 0;
        
        const scoredQuestions = category.questions.filter(q => q.avg_score > 0);
        const avgCategoryScore = scoredQuestions.length > 0
          ? scoredQuestions.reduce((sum, q) => sum + q.avg_score, 0) / scoredQuestions.length
          : 0;

        category.completion_rate = Math.round(avgCompletionRate);
        category.avg_score = avgCategoryScore;
        categoryAnalytics.push(category);
      });

      // Calculate overall summary
      const totalQuestions = questions?.length || 0;
      const totalResponses = responses?.length || 0;

      return {
        questions: questionAnalytics,
        categories: categoryAnalytics,
        summary: {
          total_questions: totalQuestions,
          total_responses: totalResponses,
          overall_completion_rate: Math.round(overallCompletionRate)
        }
      };
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const determineTrend = (
  questionType: string, 
  distribution: Record<string, number>,
  totalResponses: number
): 'positive' | 'neutral' | 'negative' | 'mixed' => {
  if (totalResponses === 0) return 'neutral';
  
  switch (questionType?.toLowerCase()) {
    case 'star rating': {
      const entries = Object.entries(distribution);
      const highRatings = entries.filter(([rating]) => parseInt(rating) >= 4)
        .reduce((sum, [, count]) => sum + count, 0);
      const highPercentage = (highRatings / totalResponses) * 100;
      
      if (highPercentage > 60) return 'positive';
      if (highPercentage < 30) return 'negative';
      return 'mixed';
    }
    
    case 'nps score': {
      let promoters = 0, detractors = 0;
      Object.entries(distribution).forEach(([score, count]) => {
        const numScore = parseInt(score) || 0;
        if (numScore >= 9) promoters += count;
        else if (numScore <= 6) detractors += count;
      });
      
      const nps = ((promoters - detractors) / totalResponses) * 100;
      if (nps > 20) return 'positive';
      if (nps < -20) return 'negative';
      return 'mixed';
    }
    
    case 'likert scale': {
      let agreement = 0;
      Object.entries(distribution).forEach(([response, count]) => {
        if (response.toLowerCase().includes('agree') && !response.toLowerCase().includes('disagree')) {
          agreement += count;
        }
      });
      
      const agreementRate = (agreement / totalResponses) * 100;
      if (agreementRate > 60) return 'positive';
      if (agreementRate < 30) return 'negative';
      return 'mixed';
    }
    
    default:
      return 'neutral';
  }
};
