
export const getPerformanceColor = (score: number): string => {
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-yellow-600';
  return 'text-red-600';
};

export const getCompletionColor = (rate: number): string => {
  if (rate >= 90) return 'text-green-600';
  if (rate >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export const analyzeQuestionPerformance = (questions: any[]) => {
  const topPerformers = questions
    .filter(q => q.avg_score >= 4)
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 5);

  const lowPerformers = questions
    .filter(q => q.avg_score < 3)
    .sort((a, b) => a.avg_score - b.avg_score)
    .slice(0, 5);

  const completionTrends = questions
    .sort((a, b) => b.completion_rate - a.completion_rate);

  return { topPerformers, lowPerformers, completionTrends };
};

export const calculatePerformanceInsights = (questions: any[], summary: any) => {
  const { topPerformers, lowPerformers } = analyzeQuestionPerformance(questions);
  const avgCompletion = questions.reduce((sum, q) => sum + q.completion_rate, 0) / questions.length;

  return {
    highPerformingQuestions: topPerformers.length,
    lowPerformingQuestions: lowPerformers.length,
    avgCompletionRate: avgCompletion,
    totalResponses: summary.total_responses
  };
};
