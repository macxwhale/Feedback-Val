
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
  
  return errors;
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
        const body = await req.json();
        
        // Validate input data
        const validationErrors = validateQuestionData(body);
        if (validationErrors.length > 0) {
          return createErrorResponse('Validation failed', 400, { validationErrors });
        }
        
        // Inject organization_id server-side into all DB writes
        const questionData = { 
          ...body, 
          organization_id: organizationId
        };
        
        console.log('Creating question with data:', questionData);
        
        const { data, error } = await supabase
          .from('questions')
          .insert(questionData)
          .select()
          .single();
        
        if (error) {
          console.error('Database error creating question:', error);
          return createErrorResponse('Failed to create question', 500, { dbError: error.message });
        }

        console.log('Successfully created question:', data.id);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'PUT': {
        const body = await req.json();
        const { id, ...updates } = body;
        
        if (!id) {
          return createErrorResponse('Question ID is required for updates', 400);
        }
        
        // Validate input data
        const validationErrors = validateQuestionData(updates);
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
        
        const { data, error } = await supabase
          .from('questions')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', organizationId)
          .select()
          .single();
        
        if (error) {
          console.error('Database error updating question:', error);
          return createErrorResponse('Failed to update question', 500, { dbError: error.message });
        }

        console.log('Successfully updated question:', id);
        return new Response(JSON.stringify(data), {
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
        
        console.log('Deleting question:', { id, organizationId });
        
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
