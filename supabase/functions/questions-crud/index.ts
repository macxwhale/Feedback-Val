
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
  
  if (data.order_index === undefined || data.order_index === null || typeof data.order_index !== 'number') {
    errors.push({ field: 'order_index', message: 'Order index is required and must be a number' });
  }
  
  if (!data.category_id || typeof data.category_id !== 'string') {
    errors.push({ field: 'category_id', message: 'Category ID is required' });
  }
  
  if (!data.type_id || typeof data.type_id !== 'string') {
    errors.push({ field: 'type_id', message: 'Type ID is required' });
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

    // 🔐 1. Extract logged-in user and get their organization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
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
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('organization_id', organizationId)
          .order('order_index');
        
        if (error) {
          return createErrorResponse('Failed to fetch questions', 500, { dbError: error.message });
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'POST': {
        const body = await req.json();
        
        // 🧪 3. Add validation before doing any DB operation
        const validationErrors = validateQuestionData(body);
        if (validationErrors.length > 0) {
          return createErrorResponse('Validation failed', 400, { validationErrors });
        }
        
        // 🧱 2. Inject org_id server-side into all DB writes
        const questionData = { 
          ...body, 
          organization_id: organizationId // Always use server-side org_id
        };
        
        console.log('Creating question with data:', questionData);
        
        const { data, error } = await supabase
          .from('questions')
          .insert(questionData)
          .select()
          .single();
        
        if (error) {
          return createErrorResponse('Failed to create question', 500, { dbError: error.message });
        }

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
        
        // 🧪 3. Add validation before doing any DB operation
        const validationErrors = validateQuestionData(updates);
        if (validationErrors.length > 0) {
          return createErrorResponse('Validation failed', 400, { validationErrors });
        }
        
        // 🔄 4. Ensure update actions check question ownership
        const { data: existingQuestion, error: fetchError } = await supabase
          .from('questions')
          .select('id, organization_id')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          return createErrorResponse('Question not found', 404, { dbError: fetchError.message });
        }
        
        if (existingQuestion.organization_id !== organizationId) {
          return createErrorResponse('Unauthorized: Question belongs to different organization', 403);
        }
        
        console.log('Updating question:', { id, updates, organizationId });
        
        const { data, error } = await supabase
          .from('questions')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', organizationId) // Double-check ownership
          .select()
          .single();
        
        if (error) {
          return createErrorResponse('Failed to update question', 500, { dbError: error.message });
        }

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
        
        // 🔄 4. Ensure delete actions check question ownership
        const { data: existingQuestion, error: fetchError } = await supabase
          .from('questions')
          .select('id, organization_id')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          return createErrorResponse('Question not found', 404, { dbError: fetchError.message });
        }
        
        if (existingQuestion.organization_id !== organizationId) {
          return createErrorResponse('Unauthorized: Question belongs to different organization', 403);
        }
        
        console.log('Deleting question:', { id, organizationId });
        
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', id)
          .eq('organization_id', organizationId); // Double-check ownership
        
        if (error) {
          return createErrorResponse('Failed to delete question', 500, { dbError: error.message });
        }

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
