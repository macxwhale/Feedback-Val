import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function logRequest(supabase: any, apiKeyId: string, organizationId: string, endpoint: string, statusCode: number, ipAddress: string) {
  await supabase.from('api_request_logs').insert({
    api_key_id: apiKeyId,
    organization_id: organizationId,
    endpoint: endpoint,
    status_code: statusCode,
    ip_address: ipAddress,
  });
}

function createErrorResponse(message: string, status = 400) {
  console.error('API Error:', message);
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 5) + 1;
};

function validateResponse(question: any, value: any): string | null {
  if (question.required && (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0))) {
    return `Response is required for question: "${question.question}"`;
  }

  if (!question.required && (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0))) {
    return null;
  }

  switch (question.type) {
    case 'star':
    case 'nps':
    case 'slider':
    case 'likert':
    case 'emoji':
      if (typeof value !== 'number' || (question.scale && (value < question.scale.min || value > question.scale.max))) {
        return `Invalid value for question "${question.question}". Expected a number between ${question.scale.min} and ${question.scale.max}, but got ${value}.`;
      }
      break;
    
    case 'ranking':
      if (!Array.isArray(value) || !value.every(item => typeof item === 'string' && question.options.includes(item))) {
        return `Invalid value for ranking question "${question.question}". Expected an array of strings from the provided options.`;
      }
      if (value.length !== question.options.length) {
        return `Invalid value for ranking question "${question.question}". All options must be ranked.`;
      }
      break;

    case 'matrix':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return `Invalid value for matrix question "${question.question}". Expected an object.`;
      }
      for (const subQuestion of question.options) {
        if (value[subQuestion] === undefined) {
          if (question.required) {
            return `Missing response for sub-question "${subQuestion}" in matrix question "${question.question}".`;
          }
        } else if (typeof value[subQuestion] !== 'number') {
          return `Invalid value for sub-question "${subQuestion}" in matrix question "${question.question}". Expected a number.`;
        }
      }
      break;
    
    case 'single-choice':
      if (typeof value !== 'string' || !question.options.includes(value)) {
        return `Invalid value for single-choice question "${question.question}". Expected one of the provided options.`;
      }
      break;

    case 'multi-choice':
      if (!Array.isArray(value) || !value.every(item => typeof item === 'string' && question.options.includes(item))) {
        return `Invalid value for multi-choice question "${question.question}". Expected an array of strings from the provided options.`;
      }
      break;

    case 'text':
      if (typeof value !== 'string') {
        return `Invalid value for text question "${question.question}". Expected a string.`;
      }
      break;

    default:
      console.warn(`Unknown question type "${question.type}" for question "${question.question}". Skipping validation.`);
      break;
  }

  return null;
}

serve(async (req) => {
  const requestUrl = new URL(req.url);
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || '';

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return createErrorResponse('Method Not Allowed', 405);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createErrorResponse('Missing or invalid Authorization header', 401);
  }
  const apiKey = authHeader.replace('Bearer ', '');

  const keyParts = apiKey.split('_');
  const prefix = keyParts.slice(0, -1).join('_');
  const secretLength = keyParts.length > 1 ? keyParts[keyParts.length - 1].length : 0;
  console.log(`[api-feedback] Received API key for validation. Prefix: ${prefix}, Secret length: ${secretLength}`);

  const { data: validationData, error: validationError } = await supabase.rpc('validate_api_key', {
    p_api_key: apiKey
  }).single();
  
  if (validationError || !validationData || !validationData.is_valid) {
    console.error('API key validation failed:', validationError);
    return createErrorResponse('Invalid API Key', 401);
  }

  const { org_id: organizationId, key_id: apiKeyId } = validationData;

  try {
    const { responses, questions, timingData, metadata } = await req.json();

    if (!responses || !questions || !Array.isArray(questions) || typeof responses !== 'object') {
      await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 400, ipAddress);
      return createErrorResponse('Invalid request body. "responses" (object) and "questions" (array) are required.', 400);
    }

    for (const questionId of Object.keys(responses)) {
      const value = responses[questionId];
      const question = questions.find((q: any) => q.id === questionId);

      if (!question) {
        await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 400, ipAddress);
        return createErrorResponse(`Question with ID "${questionId}" was not found in the provided questions list.`, 400);
      }

      const validationError = validateResponse(question, value);
      if (validationError) {
        await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 400, ipAddress);
        return createErrorResponse(validationError, 400);
      }
    }
    
    const { data: session, error: sessionError } = await supabase
      .from('feedback_sessions')
      .insert({
        organization_id: organizationId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        total_response_time_ms: timingData?.totalResponseTime,
        avg_question_time_ms: timingData?.averageQuestionTime,
        timing_metadata: timingData,
        ...(metadata || {})
      })
      .select()
      .single();
      
    if (sessionError) {
      await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 500, ipAddress);
      console.error('Error creating feedback session:', sessionError);
      throw sessionError;
    }

    const responseData = Object.entries(responses)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([questionId, value]: [string, any]) => {
        const question = questions.find((q: any) => q.id === questionId);
        return {
          question_id: questionId,
          session_id: session.id,
          organization_id: organizationId,
          response_value: value,
          question_category: question?.category || 'Comments',
          score: generateRandomScore()
        };
    });

    if (responseData.length > 0) {
      const { error: responsesError } = await supabase
        .from('feedback_responses')
        .insert(responseData);

      if (responsesError) {
        await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 500, ipAddress);
        console.error('Error storing responses:', responsesError);
        throw responsesError;
      }
    }

    await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 201, ipAddress);
    return new Response(JSON.stringify({ success: true, sessionId: session.id }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    if (organizationId && apiKeyId) {
      await logRequest(supabase, apiKeyId, organizationId, requestUrl.pathname, 500, ipAddress);
    }
    console.error('Unexpected error in api-feedback function:', error);
    if (error instanceof SyntaxError) {
        return createErrorResponse('Invalid JSON in request body', 400);
    }
    return createErrorResponse('Internal server error', 500);
  }
});
