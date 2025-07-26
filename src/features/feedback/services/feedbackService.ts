
import { supabase } from '@/integrations/supabase/client';

export interface FeedbackResponse {
  id: string;
  question_id: string;
  session_id: string;
  response_value: any;
  organization_id: string;
  created_at: string;
}

export interface FeedbackSession {
  id: string;
  organization_id: string;
  session_token: string;
  started_at: string;
  completed_at?: string;
  status: 'active' | 'completed' | 'abandoned';
}

export class FeedbackService {
  static async createSession(organizationId: string): Promise<FeedbackSession> {
    const { data, error } = await supabase
      .from('feedback_sessions')
      .insert({
        organization_id: organizationId,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async submitResponse(response: Omit<FeedbackResponse, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('feedback_responses')
      .insert(response)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getFeedbackResponses(organizationId: string) {
    const { data, error } = await supabase
      .from('feedback_responses')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
