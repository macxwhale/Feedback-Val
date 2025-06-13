
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type QuestionScaleConfig = Database['public']['Tables']['question_scale_config']['Row'];
type QuestionScaleInsert = Database['public']['Tables']['question_scale_config']['Insert'];

interface ScaleConfig {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  stepSize?: number;
}

export const questionScaleService = {
  async getScaleConfig(questionId: string): Promise<QuestionScaleConfig | null> {
    const { data, error } = await supabase
      .from('question_scale_config')
      .select('*')
      .eq('question_id', questionId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createScaleConfig(questionId: string, config: ScaleConfig): Promise<void> {
    const scaleData: QuestionScaleInsert = {
      question_id: questionId,
      min_value: config.minValue,
      max_value: config.maxValue,
      min_label: config.minLabel,
      max_label: config.maxLabel,
      step_size: config.stepSize || 1
    };

    const { error } = await supabase
      .from('question_scale_config')
      .insert(scaleData);
    
    if (error) throw error;
  },

  async updateScaleConfig(questionId: string, config: ScaleConfig): Promise<void> {
    const { error } = await supabase
      .from('question_scale_config')
      .update({
        min_value: config.minValue,
        max_value: config.maxValue,
        min_label: config.minLabel,
        max_label: config.maxLabel,
        step_size: config.stepSize || 1
      })
      .eq('question_id', questionId);
    
    if (error) throw error;
  }
};
