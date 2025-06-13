
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { questionOptionsService } from './questionOptionsService';
import { questionScaleService } from './questionScaleService';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

interface QuestionFormData {
  question_text: string;
  question_type: string;
  category: string;
  order_index: number;
  help_text?: string;
  placeholder_text?: string;
  is_required?: boolean;
  options?: { text: string; value?: string }[];
  scaleConfig?: {
    minValue: number;
    maxValue: number;
    minLabel?: string;
    maxLabel?: string;
    stepSize?: number;
  };
}

const FUNCTION_URL = 'https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/questions-crud';

const getAuthHeaders = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.access_token) {
    throw new Error('Authentication required');
  }
  
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  };
};

export const enhancedQuestionsService = {
  async createQuestionWithRelations(formData: QuestionFormData): Promise<Question> {
    try {
      const headers = await getAuthHeaders();
      
      // Create the base question
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question_text: formData.question_text,
          question_type: formData.question_type,
          category: formData.category,
          order_index: formData.order_index,
          help_text: formData.help_text,
          placeholder_text: formData.placeholder_text,
          is_required: formData.is_required || false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const question = await response.json();

      // Create options if provided
      if (formData.options && formData.options.length > 0) {
        await questionOptionsService.createOptions(question.id, formData.options);
      }

      // Create scale config if provided
      if (formData.scaleConfig) {
        await questionScaleService.createScaleConfig(question.id, formData.scaleConfig);
      }

      return question;
    } catch (error) {
      console.error('Error creating question with relations:', error);
      throw error;
    }
  },

  async updateQuestionWithRelations(id: string, formData: QuestionFormData): Promise<Question> {
    try {
      const headers = await getAuthHeaders();
      
      // Update the base question
      const response = await fetch(FUNCTION_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id,
          question_text: formData.question_text,
          question_type: formData.question_type,
          category: formData.category,
          order_index: formData.order_index,
          help_text: formData.help_text,
          placeholder_text: formData.placeholder_text,
          is_required: formData.is_required || false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const question = await response.json();

      // Update options if provided
      if (formData.options && formData.options.length > 0) {
        await questionOptionsService.updateOptions(id, formData.options);
      }

      // Update scale config if provided
      if (formData.scaleConfig) {
        const existingConfig = await questionScaleService.getScaleConfig(id);
        if (existingConfig) {
          await questionScaleService.updateScaleConfig(id, formData.scaleConfig);
        } else {
          await questionScaleService.createScaleConfig(id, formData.scaleConfig);
        }
      }

      return question;
    } catch (error) {
      console.error('Error updating question with relations:', error);
      throw error;
    }
  }
};
