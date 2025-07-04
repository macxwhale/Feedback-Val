
/**
 * Analytics Service Implementation
 * Handles analytics data processing and reporting
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  IAnalyticsService, 
  AnalyticsMetrics, 
  TrendData, 
  CategoryAnalytics, 
  AnalyticsFilters 
} from '@/domain/interfaces/IAnalyticsService';

export class AnalyticsService implements IAnalyticsService {
  async getMetrics(organizationId: string, filters?: AnalyticsFilters): Promise<AnalyticsMetrics> {
    try {
      const { data: stats } = await supabase.rpc('get_organization_stats_enhanced', {
        org_id: organizationId
      });

      if (!stats) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          averageScore: 0,
          completionRate: 0,
          responseTime: 0
        };
      }

      // Type assertion for the stats object
      const statsData = stats as any;

      return {
        totalSessions: statsData.total_sessions || 0,
        completedSessions: statsData.completed_sessions || 0,
        averageScore: statsData.avg_session_score || 0,
        completionRate: statsData.completed_sessions && statsData.total_sessions 
          ? (statsData.completed_sessions / statsData.total_sessions) * 100 
          : 0,
        responseTime: await this.calculateAverageResponseTime(organizationId)
      };
    } catch (error) {
      console.error('Error getting analytics metrics:', error);
      throw error;
    }
  }

  async getTrendData(organizationId: string, period: 'day' | 'week' | 'month'): Promise<TrendData[]> {
    try {
      const { data: sessions } = await supabase
        .from('feedback_sessions')
        .select('created_at, status, total_score')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: true });

      if (!sessions) return [];

      return this.processTrendData(sessions, period);
    } catch (error) {
      console.error('Error getting trend data:', error);
      throw error;
    }
  }

  async getCategoryAnalytics(organizationId: string): Promise<CategoryAnalytics[]> {
    try {
      const { data: responses } = await supabase
        .from('feedback_responses')
        .select('question_category, score, created_at')
        .eq('organization_id', organizationId);

      if (!responses) return [];

      return this.processCategoryAnalytics(responses);
    } catch (error) {
      console.error('Error getting category analytics:', error);
      throw error;
    }
  }

  async exportData(organizationId: string, format: 'csv' | 'json' | 'excel'): Promise<Blob> {
    try {
      const { data: responses } = await supabase
        .from('feedback_responses')
        .select('*')
        .eq('organization_id', organizationId);

      if (!responses) throw new Error('No data to export');

      return this.formatExportData(responses, format);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  private async calculateAverageResponseTime(organizationId: string): Promise<number> {
    const { data: sessions } = await supabase
      .from('feedback_sessions')
      .select('total_response_time_ms')
      .eq('organization_id', organizationId)
      .not('total_response_time_ms', 'is', null);

    if (!sessions || sessions.length === 0) return 0;

    const totalTime = sessions.reduce((sum, s) => sum + (s.total_response_time_ms || 0), 0);
    return totalTime / sessions.length;
  }

  private processTrendData(sessions: any[], period: string): TrendData[] {
    const groupedData = sessions.reduce((acc, session) => {
      const date = new Date(session.created_at);
      const key = this.getDateKey(date, period);
      
      if (!acc[key]) {
        acc[key] = { sessions: 0, totalScore: 0, completedSessions: 0 };
      }
      
      acc[key].sessions++;
      if (session.status === 'completed') {
        acc[key].completedSessions++;
      }
      if (session.total_score) {
        acc[key].totalScore += session.total_score;
      }
      
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, data]: [string, any]) => ({
      date,
      sessions: data.sessions,
      score: data.sessions > 0 ? data.totalScore / data.sessions : 0,
      completionRate: data.sessions > 0 ? (data.completedSessions / data.sessions) * 100 : 0
    }));
  }

  private processCategoryAnalytics(responses: any[]): CategoryAnalytics[] {
    const categoryData = responses.reduce((acc, response) => {
      const category = response.question_category || 'General';
      
      if (!acc[category]) {
        acc[category] = { scores: [], count: 0 };
      }
      
      acc[category].count++;
      if (response.score) {
        acc[category].scores.push(response.score);
      }
      
      return acc;
    }, {});

    return Object.entries(categoryData).map(([category, data]: [string, any]) => ({
      category,
      totalResponses: data.count,
      averageScore: data.scores.length > 0 
        ? data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length 
        : 0,
      trend: 'stable' as const // TODO: Calculate actual trend from historical data
    }));
  }

  private getDateKey(date: Date, period: string): string {
    switch (period) {
      case 'day':
        return date.toISOString().split('T')[0];
      case 'week':
        const week = this.getWeekNumber(date);
        return `${date.getFullYear()}-W${week}`;
      case 'month':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      default:
        return date.toISOString().split('T')[0];
    }
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  private formatExportData(data: any[], format: string): Blob {
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      case 'csv':
        const csv = this.convertToCSV(data);
        return new Blob([csv], { type: 'text/csv' });
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

// Export utility functions for backward compatibility
export interface AnalyticsData {
  responseTime: number;
  completionRate: number;
  engagementScore: number;
  satisfactionTrend: string;
  commonPatterns: string[];
}

export const calculateResponseTime = (startTime: number): number => {
  return Date.now() - startTime;
};

export const calculateEngagementScore = (
  responses: Record<string, any>,
  totalQuestions: number
): number => {
  const answeredCount = Object.keys(responses).length;
  const completionRate = (answeredCount / totalQuestions) * 100;
  
  // Factor in response quality (longer text responses = higher engagement)
  const qualityScore = Object.values(responses).reduce((score, value) => {
    if (typeof value === 'string' && value.length > 10) return score + 20;
    if (Array.isArray(value) && value.length > 1) return score + 15;
    return score + 10;
  }, 0) / answeredCount || 0;
  
  return Math.min(100, (completionRate + qualityScore) / 2);
};

export const generateInsights = (responses: any[]): AnalyticsData => {
  const avgScore = responses.reduce((sum, r) => sum + (r.score || 0), 0) / responses.length || 0;
  const satisfactionTrend = avgScore >= 80 ? 'positive' : avgScore >= 60 ? 'neutral' : 'needs_improvement';
  
  return {
    responseTime: Math.floor(Math.random() * 300) + 60, // Simulated
    completionRate: (responses.length / 10) * 100,
    engagementScore: avgScore,
    satisfactionTrend,
    commonPatterns: ['High satisfaction with services', 'Mobile app needs improvement']
  };
};
