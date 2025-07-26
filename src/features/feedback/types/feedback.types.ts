
export interface FeedbackResponse {
  id: string;
  question_id: string;
  session_id: string;
  response_value: any;
  organization_id: string;
  question_category: 'QualityCommunication' | 'QualityStaff' | 'ValueForMoney' | 'QualityService' | 'LikelyRecommend' | 'DidWeMakeEasy' | 'Comments' | 'Satisfaction';
  created_at: string;
  question_snapshot?: any;
  score?: number;
  question_started_at?: string;
  question_completed_at?: string;
  response_time_ms?: number;
  question_type_snapshot?: string;
  question_text_snapshot?: string;
}

export interface FeedbackSession {
  id: string;
  organization_id: string;
  started_at: string;
  completed_at?: string;
  // Match the actual database enum values
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
  user_id?: string;
  phone_number?: string;
  sms_session_id?: string;
  total_score?: number;
  category_scores?: any;
  metadata?: any;
  total_response_time_ms?: number;
  avg_question_time_ms?: number;
  timing_metadata?: any;
}

export interface CreateFeedbackResponse {
  question_id: string;
  session_id: string;
  response_value: any;
  organization_id: string;
  question_category: 'QualityCommunication' | 'QualityStaff' | 'ValueForMoney' | 'QualityService' | 'LikelyRecommend' | 'DidWeMakeEasy' | 'Comments' | 'Satisfaction';
  question_snapshot?: any;
  score?: number;
  question_started_at?: string;
  question_completed_at?: string;
  response_time_ms?: number;
  question_type_snapshot?: string;
  question_text_snapshot?: string;
}

export interface CreateFeedbackSession {
  organization_id: string;
  status?: 'started' | 'in_progress' | 'completed' | 'abandoned';
  user_id?: string;
  phone_number?: string;
  metadata?: any;
}
