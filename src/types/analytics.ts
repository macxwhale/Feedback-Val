
export interface TrendDataPoint {
  date: string;
  total_sessions: number;
  completed_sessions: number;
  completion_rate: number;
  avg_score: number;
}

export interface QuestionAnalytics {
  id: string;
  question_text: string;
  question_type: string;
  category: string;
  total_responses: number;
  completion_rate: number;
  avg_score: number;
  response_distribution: Record<string, number>;
  insights: string[];
  trend: 'positive' | 'neutral' | 'negative' | 'mixed';
}

export interface CategoryAnalytics {
  category: string;
  total_questions: number;
  total_responses: number;
  completion_rate: number;
  questions: QuestionAnalytics[];
  avg_score: number;
}

export interface AnalyticsTableData {
  questions: QuestionAnalytics[];
  categories: CategoryAnalytics[];
  summary: {
    total_questions: number;
    total_responses: number;
    overall_completion_rate: number;
  };
  trendData: TrendDataPoint[];
}
