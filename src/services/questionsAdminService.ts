
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

const FUNCTION_URL = 'https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/questions-crud';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3VycndqaWF1Y29keHV1emVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDI1NTYsImV4cCI6MjA2NTMxODU1Nn0.nr5QAlB0UyA3VQWXolIsc8lXXzwj0Ur6Nj-ddr7f7AQ';

export const questionsAdminService = {
  async getQuestions(organizationId: string): Promise<Question[]> {
    const response = await fetch(`${FUNCTION_URL}?organizationId=${organizationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  },

  async createQuestion(question: QuestionInsert): Promise<Question> {
    const response = await fetch(`${FUNCTION_URL}?organizationId=${question.organization_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    });
    if (!response.ok) throw new Error('Failed to create question');
    return await response.json();
  },

  async updateQuestion(id: string, updates: QuestionUpdate): Promise<Question> {
    const response = await fetch(`${FUNCTION_URL}?organizationId=${updates.organization_id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, ...updates })
    });
    if (!response.ok) throw new Error('Failed to update question');
    return await response.json();
  },

  async deleteQuestion(id: string, organizationId: string): Promise<void> {
    const response = await fetch(`${FUNCTION_URL}?organizationId=${organizationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete question');
  }
};
