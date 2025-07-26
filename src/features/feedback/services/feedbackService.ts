
import { supabase } from '@/integrations/supabase/client';
import { FeedbackResponse, FeedbackSession, CreateFeedbackResponse, CreateFeedbackSession } from '../types/feedback.types';

export class FeedbackService {
  static async createSession(data: CreateFeedbackSession): Promise<FeedbackSession> {
    const { data: result, error } = await supabase
      .from('feedback_sessions')
      .insert({
        organization_id: data.organization_id,
        status: data.status || 'started',
        user_id: data.user_id,
        phone_number: data.phone_number,
        metadata: data.metadata
      })
      .select()
      .single();

    if (error) throw error;
    
    // Transform the result to match our interface
    return {
      id: result.id,
      organization_id: result.organization_id,
      started_at: result.started_at,
      completed_at: result.completed_at,
      status: result.status,
      created_at: result.created_at,
      user_id: result.user_id,
      phone_number: result.phone_number,
      sms_session_id: result.sms_session_id,
      total_score: result.total_score,
      category_scores: result.category_scores,
      metadata: result.metadata,
      total_response_time_ms: result.total_response_time_ms,
      avg_question_time_ms: result.avg_question_time_ms,
      timing_metadata: result.timing_metadata
    };
  }

  static async submitResponse(response: CreateFeedbackResponse): Promise<FeedbackResponse> {
    const { data, error } = await supabase
      .from('feedback_responses')
      .insert({
        question_id: response.question_id,
        session_id: response.session_id,
        response_value: response.response_value,
        organization_id: response.organization_id,
        question_category: response.question_category,
        question_snapshot: response.question_snapshot,
        score: response.score,
        question_started_at: response.question_started_at,
        question_completed_at: response.question_completed_at,
        response_time_ms: response.response_time_ms,
        question_type_snapshot: response.question_type_snapshot,
        question_text_snapshot: response.question_text_snapshot
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getFeedbackResponses(organizationId: string): Promise<FeedbackResponse[]> {
    const { data, error } = await supabase
      .from('feedback_responses')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
