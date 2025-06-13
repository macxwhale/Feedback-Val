
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

export const questionsAdminService = {
  async getQuestions(organizationId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('order_index');
    if (error) throw error;
    return data || [];
  },

  async createQuestion(question: QuestionInsert): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuestion(id: string, updates: QuestionUpdate): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
