
import { CategoryAnalytics, QuestionAnalytics } from '@/types/analytics';

export const processCategoriesAnalytics = (questions: QuestionAnalytics[]): CategoryAnalytics[] => {
  const categoryMap = new Map<string, QuestionAnalytics[]>();
  questions.forEach(q => {
    const category = q.category || 'General';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(q);
  });

  return Array.from(categoryMap.entries()).map(([category, categoryQuestions]) => {
    const totalResponses = categoryQuestions.reduce((sum, q) => sum + q.total_responses, 0);
    const avgCompletionRate = categoryQuestions.length > 0
      ? categoryQuestions.reduce((sum, q) => sum + q.completion_rate, 0) / categoryQuestions.length
      : 0;
    const avgScore = categoryQuestions.length > 0
      ? categoryQuestions.reduce((sum, q) => sum + q.avg_score, 0) / categoryQuestions.length
      : 0;
    const avgResponseTime = categoryQuestions.length > 0
      ? categoryQuestions.reduce((sum, q) => sum + (q.avg_response_time_ms || 0), 0) / categoryQuestions.length
      : 0;

    return {
      category,
      total_questions: categoryQuestions.length,
      total_responses: totalResponses,
      completion_rate: Math.round(avgCompletionRate),
      questions: categoryQuestions,
      avg_score: Math.round(avgScore * 100) / 100,
      avg_response_time_ms: Math.round(avgResponseTime)
    };
  });
};
