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

export const getResponseTimeColor = (timeInMs: number): string => {
  const timeInS = timeInMs / 1000;
  if (timeInS < 5) return 'text-green-600'; // Fast
  if (timeInS < 15) return 'text-yellow-600'; // Normal
  return 'text-red-600'; // Slow
};

export const analyzeQuestionPerformance = (questions: any[]) => {
  const questionsWithTime = questions.filter(q => q.avg_response_time_ms && q.avg_response_time_ms > 0);

  const topPerformers = [...questionsWithTime]
    .sort((a, b) => a.avg_response_time_ms - b.avg_response_time_ms)
    .slice(0, 5);

  const lowPerformers = [...questionsWithTime]
    .sort((a, b) => b.avg_response_time_ms - a.avg_response_time_ms)
    .slice(0, 5);

  const completionTrends = questions
    .sort((a, b) => b.completion_rate - a.completion_rate);

  return { topPerformers, lowPerformers, completionTrends };
};

export const calculatePerformanceInsights = (questions: any[], summary: any) => {
  const questionsWithTime = questions.filter(q => q.avg_response_time_ms && q.avg_response_time_ms > 0);

  const fastQuestions = questionsWithTime.filter(q => q.avg_response_time_ms < 5000); // Less than 5s
  const slowQuestions = questionsWithTime.filter(q => q.avg_response_time_ms > 15000); // More than 15s

  const avgCompletion = questions.length > 0 ? questions.reduce((sum, q) => sum + q.completion_rate, 0) / questions.length : 0;
  
  const totalAvgResponseTime = questionsWithTime.length > 0
    ? questionsWithTime.reduce((sum, q) => sum + q.avg_response_time_ms, 0) / questionsWithTime.length
    : 0;

  return {
    fastRespondingQuestions: fastQuestions.length,
    slowRespondingQuestions: slowQuestions.length,
    avgCompletionRate: avgCompletion,
    totalResponses: summary.total_responses,
    avgResponseTime: totalAvgResponseTime
  };
};
