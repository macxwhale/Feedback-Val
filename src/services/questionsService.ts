import { supabase } from '@/integrations/supabase/client';

const FUNCTION_URL = 'https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/questions-crud';
const PUBLIC_QUESTIONS_FUNCTION_URL = 'https://rigurrwjiaucodxuuzeh.supabase.co/functions/v1/public-questions';

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

// Helper to get auth headers
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

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

// Transform database question to frontend format
const transformQuestion = (dbQuestion: any) => {
  return {
    id: dbQuestion.id,
    type: dbQuestion.question_type,
    question: dbQuestion.question_text,
    required: dbQuestion.is_required || false,
    category: dbQuestion.category,
    options: dbQuestion.question_options?.map((opt: any) => opt.option_text) || [],
    scale: dbQuestion.question_scale_config?.[0] ? {
      min: dbQuestion.question_scale_config[0].min_value,
      max: dbQuestion.question_scale_config[0].max_value,
      minLabel: dbQuestion.question_scale_config[0].min_label,
      maxLabel: dbQuestion.question_scale_config[0].max_label
    } : undefined
  };
};

// Generate random score for testing/demo purposes
export const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 5) + 1;
};

// Store feedback responses in database
export const storeFeedbackResponses = async (
  responses: Record<string, any>,
  organizationId: string,
  questions: any[]
) => {
  try {
    // Create a feedback session
    const { data: session, error: sessionError } = await supabase
      .from('feedback_sessions')
      .insert({
        organization_id: organizationId,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating feedback session:', sessionError);
      throw sessionError;
    }

    // Store individual responses
    const responseData = Object.entries(responses).map(([questionId, value]) => {
      const question = questions.find(q => q.id === questionId);
      return {
        question_id: questionId,
        session_id: session.id,
        organization_id: organizationId,
        response_value: value,
        question_category: question?.category || 'Comments',
        score: generateRandomScore()
      };
    });

    const { error: responsesError } = await supabase
      .from('feedback_responses')
      .insert(responseData);

    if (responsesError) {
      console.error('Error storing responses:', responsesError);
      throw responsesError;
    }

    console.log('Feedback responses stored successfully:', responseData.length, 'responses');
    return session;
  } catch (error) {
    console.error('Error in storeFeedbackResponses:', error);
    throw error;
  }
};

// Fetch questions for frontend form (optimized for user feedback)
export const fetchQuestions = async (organizationSlug?: string) => {
  if (!organizationSlug) {
    console.warn('fetchQuestions called without organizationSlug');
    return [];
  }
  try {
    const response = await fetch(`${PUBLIC_QUESTIONS_FUNCTION_URL}?organizationSlug=${organizationSlug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const questions = await handleResponse(response);
    return questions.map(transformQuestion);
  } catch (error) {
    console.error('Error fetching questions for form:', error);
    throw error;
  }
};

// Main questions service for admin operations
export const questionsService = {
  async getQuestions() {
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

  async createQuestion(question: QuestionFormData) {
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

  async updateQuestion(id: string, updates: QuestionFormData) {
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

  async deleteQuestion(id: string) {
    try {
      // Use the safe deletion function
      const { data, error } = await supabase.rpc('safe_delete_question', {
        question_uuid: id
      });

      if (error) {
        console.error('Error deleting question:', error);
        throw error;
      }

      // data will be true if actually deleted, false if archived
      return { deleted: data, archived: !data };
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  async getQuestionTypes() {
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
  },

  async getQuestionCategories() {
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
  }
};
