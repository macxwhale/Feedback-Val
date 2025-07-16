
import { QuestionAnalytics } from '@/types/analytics';

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
