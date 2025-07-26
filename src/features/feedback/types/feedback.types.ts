
export interface Question {
  id: string;
  organization_id: string;
  question_text: string;
  question_type: 'text' | 'rating' | 'multiple_choice' | 'yes_no';
  is_required: boolean;
  order_index: number;
  is_active: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  option_value: string;
  display_order: number;
  is_active: boolean;
}

export interface FeedbackMetrics {
  totalResponses: number;
  completionRate: number;
  averageRating?: number;
  responsesByDay: Array<{ date: string; count: number }>;
}
