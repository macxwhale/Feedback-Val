
import { 
  calculateSafePercentageChange, 
  calculateSafeGrowthRate, 
  normalizeScore, 
  validateSessionData 
} from '@/utils/metricCalculations';
import { QuestionAnalytics, CategoryAnalytics, TrendDataPoint } from '@/types/analytics';

export const calculateSessionMetrics = (sessionsData: any[]) => {
  const cleanedSessions = validateSessionData(sessionsData || []);
  
  const totalSessions = cleanedSessions.length;
  const completedSessions = cleanedSessions.filter(s => s.status === 'completed').length;
  const inProgressSessions = cleanedSessions.filter(s => s.status === 'in_progress').length;
  const abandonedSessions = totalSessions - completedSessions - inProgressSessions;

  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const completedSessionsWithScores = cleanedSessions.filter(s => 
    s.status === 'completed' && s.total_score !== null
  );
  
  const normalizedScores = completedSessionsWithScores.map(s => normalizeScore(s.total_score));
  const avgSessionScore = normalizedScores.length > 0 
    ? normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length 
    : 0;

  const highSatisfactionSessions = normalizedScores.filter(score => score >= 4).length;
  const userSatisfactionRate = normalizedScores.length > 0 
    ? Math.round((highSatisfactionSessions / normalizedScores.length) * 100) 
    : 0;

  return {
    totalSessions,
    completedSessions,
    inProgressSessions,
    abandonedSessions,
    completionRate,
    avgSessionScore,
    userSatisfactionRate,
    cleanedSessions
  };
};

export const calculateGrowthMetrics = (cleanedSessions: any[]) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const currentPeriodSessions = cleanedSessions.filter(s => 
    new Date(s.created_at) >= thirtyDaysAgo
  ).length;
  const previousPeriodSessions = cleanedSessions.filter(s => 
    new Date(s.created_at) >= sixtyDaysAgo && new Date(s.created_at) < thirtyDaysAgo
  ).length;

  return calculateSafeGrowthRate(currentPeriodSessions, previousPeriodSessions);
};

export const processQuestionsAnalytics = (questionsData: any[], responsesData: any[], totalSessions: number): QuestionAnalytics[] => {
  return (questionsData || []).map(question => {
    const questionResponses = (responsesData || []).filter(r => r.question_id === question.id);
    const totalResponses = questionResponses.length;
    
    const uniqueSessions = new Set(questionResponses.map(r => r.session_id));
    const questionCompletionRate = totalSessions > 0 
      ? Math.round((uniqueSessions.size / totalSessions) * 100) 
      : 0;

    const scoredResponses = questionResponses.filter(r => r.score !== null);
    const avgScore = scoredResponses.length > 0 
      ? scoredResponses.reduce((sum, r) => sum + (r.score || 0), 0) / scoredResponses.length 
      : 0;

    const timedResponses = questionResponses.filter(r => r.response_time_ms !== null);
    const avgResponseTime = timedResponses.length > 0 
      ? timedResponses.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / timedResponses.length 
      : 0;

    const insights: string[] = [];
    if (questionCompletionRate > 90) {
      insights.push("High engagement - users complete this question consistently");
    }
    if (questionCompletionRate < 70) {
      insights.push("Low completion - consider simplifying or repositioning");
    }
    if (avgScore > 4) {
      insights.push("Positive sentiment - high satisfaction scores");
    }
    if (avgScore < 2.5) {
      insights.push("Negative sentiment - requires attention");
    }
    if (avgResponseTime > 30000) {
      insights.push("Long response time - may indicate complexity");
    }

    return {
      id: question.id,
      question_text: question.question_text,
      question_type: question.question_type || 'text',
      category: question.category || 'General',
      total_responses: totalResponses,
      completion_rate: questionCompletionRate,
      avg_score: Math.round(avgScore * 100) / 100,
      avg_response_time_ms: Math.round(avgResponseTime),
      response_distribution: {},
      insights,
      trend: avgScore > 3.5 ? 'positive' : avgScore < 2.5 ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral' | 'mixed'
    };
  });
};

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

export const generateTrendData = (cleanedSessions: any[]): TrendDataPoint[] => {
  const trendData: TrendDataPoint[] = [];
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  last30Days.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = cleanedSessions.filter(s => 
      s.created_at.startsWith(dateStr)
    );
    
    const totalSessions = daySessions.length;
    const completedSessions = daySessions.filter(s => s.status === 'completed').length;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    
    const completedWithScores = daySessions.filter(s => s.status === 'completed' && s.total_score !== null);
    const dayNormalizedScores = completedWithScores.map(s => normalizeScore(s.total_score));
    const avgScore = dayNormalizedScores.length > 0 
      ? dayNormalizedScores.reduce((sum, score) => sum + score, 0) / dayNormalizedScores.length 
      : 0;

    trendData.push({
      date: dateStr,
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      completion_rate: completionRate,
      avg_score: Math.round(avgScore * 100) / 100
    });
  });

  return trendData;
};
