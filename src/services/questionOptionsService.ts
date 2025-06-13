
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type QuestionOption = Database['public']['Tables']['question_options']['Row'];
type QuestionOptionInsert = Database['public']['Tables']['question_options']['Insert'];

export const questionOptionsService = {
  async getQuestionOptions(questionId: string): Promise<QuestionOption[]> {
    const { data, error } = await supabase
      .from('question_options')
      .select('*')
      .eq('question_id', questionId)
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  },

  async createOptions(questionId: string, options: { text: string; value?: string }[]): Promise<void> {
    const optionsData: QuestionOptionInsert[] = options.map((option, index) => ({
      question_id: questionId,
      option_text: option.text,
      option_value: option.value,
      display_order: index + 1
    }));

    const { error } = await supabase
      .from('question_options')
      .insert(optionsData);
    
    if (error) throw error;
  },

  async updateOptions(questionId: string, options: { text: string; value?: string }[]): Promise<void> {
    // Delete existing options
    await supabase
      .from('question_options')
      .delete()
      .eq('question_id', questionId);
    
    // Create new options
    await this.createOptions(questionId, options);
  }
};
