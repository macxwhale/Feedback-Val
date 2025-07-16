
import { 
  calculateSafePercentageChange, 
  calculateSafeGrowthRate, 
  normalizeScore, 
  validateSessionData 
} from '@/utils/metricCalculations';

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
