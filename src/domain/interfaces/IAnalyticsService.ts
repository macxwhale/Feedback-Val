
/**
 * Analytics Service Interface
 * Defines the contract for analytics-related operations
 */

export interface AnalyticsMetrics {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  completionRate: number;
  responseTime: number;
}

export interface TrendData {
  date: string;
  sessions: number;
  score: number;
  completionRate: number;
}

export interface CategoryAnalytics {
  category: string;
  totalResponses: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  categories?: string[];
  organizationId?: string;
}

export interface IAnalyticsService {
  getMetrics(organizationId: string, filters?: AnalyticsFilters): Promise<AnalyticsMetrics>;
  getTrendData(organizationId: string, period: 'day' | 'week' | 'month'): Promise<TrendData[]>;
  getCategoryAnalytics(organizationId: string): Promise<CategoryAnalytics[]>;
  exportData(organizationId: string, format: 'csv' | 'json' | 'excel'): Promise<Blob>;
}
