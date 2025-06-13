
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface ValidationError {
  field: string;
  message: string;
}

interface QuestionData {
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

function validateQuestionData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.question_text || typeof data.question_text !== 'string' || data.question_text.trim().length === 0) {
    errors.push({ field: 'question_text', message: 'Question text is required and cannot be empty' });
  }
  
  if (!data.question_type || typeof data.question_type !== 'string') {
    errors.push({ field: 'question_type', message: 'Question type is required' });
  }
  
  if (!data.category || typeof data.category !== 'string') {
    errors.push({ field: 'category', message: 'Category is required' });
  }
  
  if (data.order_index === undefined || data.order_index === null || typeof data.order_index !== 'number' || data.order_index <= 0) {
    errors.push({ field: 'order_index', message: 'Order index is required and must be a positive number' });
  }

  // Validate type-specific requirements
  if (data.question_type === 'multiple_choice' || data.question_type === 'checkbox') {
    if (!data.options || !Array.isArray(data.options) || data.options.length === 0) {
      errors.push({ field: 'options', message: `${data.question_type} questions require at least one option` });
    } else {
      data.options.forEach((option: any, index: number) => {
        if (!option.text || typeof option.text !== 'string' || option.text.trim().length === 0) {
          errors.push({ field: `options[${index}].text`, message: 'Option text is required' });
        }
      });
    }
  }

  if (data.question_type === 'scale' || data.question_type === 'star' || data.question_type === 'likert') {
    if (data.scaleConfig) {
      const { minValue, maxValue, stepSize } = data.scaleConfig;
      if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
        errors.push({ field: 'scaleConfig', message: 'Scale min and max values must be numbers' });
      } else if (minValue >= maxValue) {
        errors.push({ field: 'scaleConfig', message: 'Scale max value must be greater than min value' });
      }
      if (stepSize !== undefined && (typeof stepSize !== 'number' || stepSize <= 0)) {
        errors.push({ field: 'scaleConfig.stepSize', message: 'Step size must be a positive number' });
      }
    }
  }
  
  return errors;
}

async function createQuestionOptions(supabase: any, questionId: string, options: { text: string; value?: string }[]) {
  const optionsData = options.map((option, index) => ({
    question_id: questionId,
    option_text: option.text,
    option_value: option.value || option.text,
    display_order: index + 1
  }));

  const { error } = await supabase
    .from('question_options')
    .insert(optionsData);
  
  if (error) {
    console.error('Error creating question options:', error);
    throw error;
  }
}

async function createQuestionScale(supabase: any, questionId: string, scaleConfig: any) {
  const scaleData = {
    question_id: questionId,
    min_value: scaleConfig.minValue,
    max_value: scaleConfig.maxValue,
    min_label: scaleConfig.minLabel,
    max_label: scaleConfig.maxLabel,
    step_size: scaleConfig.stepSize || 1
  };

  const { error } = await supabase
    .from('question_scale_config')
    .insert(scaleData);
  
  if (error) {
    console.error('Error creating question scale config:', error);
    throw error;
  }
}

async function updateQuestionOptions(supabase: any, questionId: string, options: { text: string; value?: string }[]) {
  // Delete existing options
  await supabase
    .from('question_options')
    .delete()
    .eq('question_id', questionId);
  
  // Create new options if provided
  if (options && options.length > 0) {
    await createQuestionOptions(supabase, questionId, options);
  }
}

async function updateQuestionScale(supabase: any, questionId: string, scaleConfig: any) {
  if (!scaleConfig) return;

  // Check if scale config exists
  const { data: existingConfig } = await supabase
    .from('question_scale_config')
    .select('id')
    .eq('question_id', questionId)
    .single();

  const scaleData = {
    min_value: scaleConfig.minValue,
    max_value: scaleConfig.maxValue,
    min_label: scaleConfig.minLabel,
    max_label: scaleConfig.maxLabel,
    step_size: scaleConfig.stepSize || 1
  };

  if (existingConfig) {
    // Update existing config
    const { error } = await supabase
      .from('question_scale_config')
      .update(scaleData)
      .eq('question_id', questionId);
    
    if (error) {
      console.error('Error updating question scale config:', error);
      throw error;
    }
  } else {
    // Create new config
    await createQuestionScale(supabase, questionId, scaleConfig);
  }
}

function createErrorResponse(message: string, status: number = 400, details?: any) {
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };
  
  console.error('API Error:', errorResponse);
  
  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

serve(async (req) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Extract logged-in user and get their organization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication failed:', userError?.message);
      return createErrorResponse('Authentication required', 401, { userError: userError?.message });
    }

    // Query user's organization securely from organization_users table
    const { data: orgUser, error: orgError } = await supabase
      .from('organization_users')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (orgError || !orgUser) {
      console.error('Organization access failed:', orgError?.message);
      return createErrorResponse('No active organization access found', 403, { orgError: orgError?.message });
    }

    const organizationId = orgUser.organization_id;
    const { method } = req;

    console.log('questions-crud function called:', { 
      method, 
      userId: user.id, 
      organizationId,
      userRole: orgUser.role 
    });

    switch (method) {
      case 'GET': {
        console.log('Fetching questions for organization:', organizationId);
        
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('organization_id', organizationId)
          .order('order_index');
        
        if (error) {
          console.error('Database error fetching questions:', error);
          return createErrorResponse('Failed to fetch questions', 500, { dbError: error.message });
        }

        console.log(`Successfully fetched ${data?.length || 0} questions`);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'POST': {
        const body: QuestionData = await req.json();
        
        // Validate input data
        const validationErrors = validateQuestionData(body);
        if (validationErrors.length > 0) {
          return createErrorResponse('Validation failed', 400, { validationErrors });
        }
        
        // Inject organization_id server-side into all DB writes
        const questionData = { 
          question_text: body.question_text,
          question_type: body.question_type,
          category: body.category,
          order_index: body.order_index,
          help_text: body.help_text,
          placeholder_text: body.placeholder_text,
          is_required: body.is_required || false,
          organization_id: organizationId
        };
        
        console.log('Creating question with data:', questionData);
        
        // Create the base question
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert(questionData)
          .select()
          .single();
        
        if (questionError) {
          console.error('Database error creating question:', questionError);
          return createErrorResponse('Failed to create question', 500, { dbError: questionError.message });
        }

        console.log('Successfully created question:', question.id);

        // Handle type-specific data
        try {
          // Create options for multiple choice or checkbox questions
          if ((body.question_type === 'multiple_choice' || body.question_type === 'checkbox') && body.options) {
            await createQuestionOptions(supabase, question.id, body.options);
            console.log('Created question options for question:', question.id);
          }

          // Create scale config for scale, star, or likert questions
          if ((body.question_type === 'scale' || body.question_type === 'star' || body.question_type === 'likert') && body.scaleConfig) {
            await createQuestionScale(supabase, question.id, body.scaleConfig);
            console.log('Created scale config for question:', question.id);
          }
        } catch (relatedError) {
          // If related data creation fails, we should clean up the question
          console.error('Error creating related data, cleaning up question:', relatedError);
          await supabase.from('questions').delete().eq('id', question.id);
          return createErrorResponse('Failed to create question with related data', 500, { dbError: relatedError.message });
        }

        return new Response(JSON.stringify(question), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'PUT': {
        const body: QuestionData & { id: string } = await req.json();
        const { id, options, scaleConfig, ...updates } = body;
        
        if (!id) {
          return createErrorResponse('Question ID is required for updates', 400);
        }
        
        // Validate input data
        const validationErrors = validateQuestionData(body);
        if (validationErrors.length > 0) {
          return createErrorResponse('Validation failed', 400, { validationErrors });
        }
        
        // Ensure update actions check question ownership
        const { data: existingQuestion, error: fetchError } = await supabase
          .from('questions')
          .select('id, organization_id')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Question not found:', fetchError);
          return createErrorResponse('Question not found', 404, { dbError: fetchError.message });
        }
        
        if (existingQuestion.organization_id !== organizationId) {
          console.error('Unauthorized update attempt:', { questionOrg: existingQuestion.organization_id, userOrg: organizationId });
          return createErrorResponse('Unauthorized: Question belongs to different organization', 403);
        }
        
        console.log('Updating question:', { id, updates, organizationId });
        
        // Update the base question
        const { data: question, error: updateError } = await supabase
          .from('questions')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', organizationId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Database error updating question:', updateError);
          return createErrorResponse('Failed to update question', 500, { dbError: updateError.message });
        }

        // Handle type-specific data updates
        try {
          // Update options for multiple choice or checkbox questions
          if (body.question_type === 'multiple_choice' || body.question_type === 'checkbox') {
            await updateQuestionOptions(supabase, id, options || []);
            console.log('Updated question options for question:', id);
          }

          // Update scale config for scale, star, or likert questions
          if ((body.question_type === 'scale' || body.question_type === 'star' || body.question_type === 'likert') && scaleConfig) {
            await updateQuestionScale(supabase, id, scaleConfig);
            console.log('Updated scale config for question:', id);
          }
        } catch (relatedError) {
          console.error('Error updating related data:', relatedError);
          return createErrorResponse('Failed to update question related data', 500, { dbError: relatedError.message });
        }

        console.log('Successfully updated question:', id);
        return new Response(JSON.stringify(question), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'DELETE': {
        const body = await req.json();
        const { id } = body;
        
        if (!id) {
          return createErrorResponse('Question ID is required for deletion', 400);
        }
        
        // Ensure delete actions check question ownership
        const { data: existingQuestion, error: fetchError } = await supabase
          .from('questions')
          .select('id, organization_id')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Question not found for deletion:', fetchError);
          return createErrorResponse('Question not found', 404, { dbError: fetchError.message });
        }
        
        if (existingQuestion.organization_id !== organizationId) {
          console.error('Unauthorized delete attempt:', { questionOrg: existingQuestion.organization_id, userOrg: organizationId });
          return createErrorResponse('Unauthorized: Question belongs to different organization', 403);
        }
        
        console.log('Deleting question and related data:', { id, organizationId });
        
        // Delete related data first (foreign key constraints)
        await supabase.from('question_options').delete().eq('question_id', id);
        await supabase.from('question_scale_config').delete().eq('question_id', id);
        
        // Delete the question
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', id)
          .eq('organization_id', organizationId);
        
        if (error) {
          console.error('Database error deleting question:', error);
          return createErrorResponse('Failed to delete question', 500, { dbError: error.message });
        }

        console.log('Successfully deleted question:', id);
        return new Response(JSON.stringify({ success: true, message: 'Question deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return createErrorResponse('Method not allowed', 405, { allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'] });
    }
  } catch (error) {
    console.error('Unexpected error in questions-crud function:', error);
    return createErrorResponse('Internal server error', 500, { 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});
