
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['questions']['Update'];
type QuestionCategory = Database['public']['Tables']['question_categories']['Row'];
type QuestionType = Database['public']['Tables']['question_types']['Row'];

const FUNCTION_URL = 'https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/questions-crud';

// Helper function to get auth headers using Supabase client
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

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

export const questionsAdminService = {
  async getQuestions(): Promise<Question[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(FUNCTION_URL, {
        method: 'GET',
        headers
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  async createQuestion(question: Omit<QuestionInsert, 'organization_id'>): Promise<Question> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(question)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  async updateQuestion(id: string, updates: Omit<QuestionUpdate, 'organization_id'>): Promise<Question> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(FUNCTION_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, ...updates })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  async deleteQuestion(id: string): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(FUNCTION_URL, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id })
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  async getQuestionCategories(): Promise<QuestionCategory[]> {
    try {
      const { data, error } = await supabase
        .from('question_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching question categories:', error);
      return [];
    }
  },

  async getQuestionTypes(): Promise<QuestionType[]> {
    try {
      const { data, error } = await supabase
        .from('question_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching question types:', error);
      return [];
    }
  }
};
