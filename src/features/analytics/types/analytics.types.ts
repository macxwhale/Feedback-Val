
export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  groupBy: 'day' | 'week' | 'month';
}
