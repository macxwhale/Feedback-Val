
import { supabase } from '@/integrations/supabase/client';
import { FeedbackResponse, FeedbackSession, CreateFeedbackResponse, CreateFeedbackSession } from '../types/feedback.types';

export class FeedbackService {
  static async createSession(data: CreateFeedbackSession): Promise<FeedbackSession> {
    const { data: result, error } = await supabase
      .from('feedback_sessions')
      .insert({
        organization_id: data.organization_id,
        status: data.status || 'active'
      })
      .select()
      .single();

    if (error) throw error;
    
    // Transform the result to match our interface, making session_token optional
    return {
      id: result.id,
      organization_id: result.organization_id,
      started_at: result.created_at,
      completed_at: result.completed_at,
      status: result.status,
      session_token: result.session_token
    };
  }

  static async submitResponse(response: CreateFeedbackResponse): Promise<FeedbackResponse> {
    const { data, error } = await supabase
      .from('feedback_responses')
      .insert(response)
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
