
import { TrendDataPoint } from '@/types/analytics';
import { normalizeScore } from '@/utils/metricCalculations';

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
