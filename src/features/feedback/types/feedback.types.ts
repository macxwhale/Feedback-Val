
export interface FeedbackResponse {
  id: string;
  question_id: string;
  session_id: string;
  response_value: any;
  organization_id: string;
  question_category: 'QualityCommunication' | 'QualityStaff' | 'ValueForMoney' | 'QualityService' | 'LikelyRecommend' | 'DidWeMakeEasy' | 'Comments' | 'Satisfaction';
  created_at: string;
}

export interface FeedbackSession {
  id: string;
  organization_id: string;
  started_at: string;
  completed_at?: string;
  status: 'active' | 'completed' | 'abandoned';
  // Make session_token optional since it's not always required
  session_token?: string;
}

export interface CreateFeedbackResponse {
  question_id: string;
  session_id: string;
  response_value: any;
  organization_id: string;
  question_category: 'QualityCommunication' | 'QualityStaff' | 'ValueForMoney' | 'QualityService' | 'LikelyRecommend' | 'DidWeMakeEasy' | 'Comments' | 'Satisfaction';
}

export interface CreateFeedbackSession {
  organization_id: string;
  status?: 'active' | 'completed' | 'abandoned';
}
