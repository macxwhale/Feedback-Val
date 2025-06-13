
import { QuestionConfig } from '@/components/FeedbackForm';
import { supabase } from '@/integrations/supabase/client';

export const fetchQuestions = async (organizationId?: string): Promise<QuestionConfig[]> => {
  try {
    console.log('fetchQuestions - Fetching for organizationId:', organizationId);
    
    let query = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    // If organizationId is provided, filter by it
    if (organizationId && organizationId !== 'fallback-police-sacco') {
      query = query.eq('organization_id', organizationId);
    }

    const { data: questions, error } = await query;

    if (error) {
      console.error('fetchQuestions - Supabase error:', error);
      // Fallback to local questions if database fails
      return getFallbackQuestions();
    }

    if (!questions || questions.length === 0) {
      console.log('fetchQuestions - No questions found, using fallback');
      return getFallbackQuestions();
    }

    console.log('fetchQuestions - Found questions:', questions);
    return questions?.map(q => ({
      id: q.id,
      type: q.question_type as QuestionConfig['type'],
      question: q.question_text,
      required: q.required,
      category: q.category as QuestionConfig['category'],
      options: q.options as string[] | undefined,
      scale: q.scale as QuestionConfig['scale'] | undefined
    })) || [];
  } catch (error) {
    console.error('fetchQuestions - Network error:', error);
    return getFallbackQuestions();
  }
};

const getFallbackQuestions = (): QuestionConfig[] => {
  console.log('getFallbackQuestions - Using fallback questions');
  return [
    {
      id: 'service-quality',
      type: 'star',
      question: 'How would you rate the quality of service you receive from us?',
      required: true,
      category: 'QualityService',
      scale: { min: 1, max: 5 }
    },
    {
      id: 'recommend',
      type: 'nps',
      question: 'Would you recommend us to others?',
      required: true,
      category: 'LikeliRecommend',
      scale: { min: 0, max: 10 }
    },
    {
      id: 'staff-treatment',
      type: 'star',
      question: 'How well do our staff treat you as a customer?',
      required: true,
      category: 'QualityStaff',
      scale: { min: 1, max: 5 }
    },
    {
      id: 'communication',
      type: 'star',
      question: 'How well do we communicate with you?',
      required: true,
      category: 'QualityCommunication',
      scale: { min: 1, max: 5 }
    },
    {
      id: 'value-for-money',
      type: 'star',
      question: 'How would you rate the value for your money?',
      required: true,
      category: 'ValueForMoney',
      scale: { min: 1, max: 5 }
    },
    {
      id: 'ease-of-business',
      type: 'likert',
      question: 'Did we make it easy for you to do business with us?',
      required: true,
      category: 'DidWeMakeEasy',
      scale: {
        min: 1,
        max: 5,
        minLabel: 'Very Difficult',
        maxLabel: 'Very Easy'
      }
    },
    {
      id: 'comments',
      type: 'text',
      question: 'Please let us know why you scored us this way and what would make you happier',
      required: false,
      category: 'Comments'
    }
  ];
};

export const generateRandomScore = () => Math.floor(Math.random() * 100) + 1;

export const saveFeedbackSession = async (responses: any[], organizationId: string, sessionId?: string) => {
  try {
    const categoryScores: Record<string, number[]> = {};
    const responsesToSave = [];
    
    // Calculate category scores
    for (const [questionId, value] of Object.entries(responses)) {
      const score = generateRandomScore();
      responsesToSave.push({
        session_id: sessionId || crypto.randomUUID(),
        question_id: questionId,
        question_category: 'QualityService', // This should be fetched from the question
        response_value: value,
        score,
        organization_id: organizationId
      });
    }

    // Save responses
    const { error: responseError } = await supabase
      .from('feedback_responses')
      .insert(responsesToSave);

    if (responseError) {
      console.error('Error saving responses:', responseError);
      throw responseError;
    }

    return { success: true, sessionId };
  } catch (error) {
    console.error('Error saving feedback session:', error);
    throw error;
  }
};
