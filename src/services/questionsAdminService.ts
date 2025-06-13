
import { Database } from '@/integrations/supabase/types';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

const FUNCTION_URL = 'https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/questions-crud';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3VycndqaWF1Y29keHV1emVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDI1NTYsImV4cCI6MjA2NTMxODU1Nn0.nr5QAlB0UyA3VQWXolIsc8lXXzwj0Ur6Nj-ddr7f7AQ';

// Get auth token from localStorage (Supabase stores it there)
const getAuthToken = () => {
  const session = JSON.parse(localStorage.getItem('sb-rigurrwjiaucodxuuzeh-auth-token') || '{}');
  return session?.access_token;
};

export const questionsAdminService = {
  async getQuestions(): Promise<Question[]> {
    const response = await fetch(FUNCTION_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  },

  async createQuestion(question: Omit<QuestionInsert, 'organization_id'>): Promise<Question> {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    });
    if (!response.ok) throw new Error('Failed to create question');
    return await response.json();
  },

  async updateQuestion(id: string, updates: Omit<QuestionUpdate, 'organization_id'>): Promise<Question> {
    const response = await fetch(FUNCTION_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, ...updates })
    });
    if (!response.ok) throw new Error('Failed to update question');
    return await response.json();
  },

  async deleteQuestion(id: string): Promise<void> {
    const response = await fetch(FUNCTION_URL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete question');
  }
};
