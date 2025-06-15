
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to format a question for SMS delivery
const formatQuestionForSms = (question: any): string => {
  let smsText = question.question_text
  if (question.question_type === 'multiple-choice' && question.question_options && question.question_options.length > 0) {
    const optionsText = question.question_options
      .map((opt: any, index: number) => `${index + 1}. ${opt.option_text}`)
      .join('\n')
    smsText += `\n${optionsText}`
  } else if (['star', 'nps', 'rating'].includes(question.question_type)) {
    const scale = question.question_scale_config?.[0] || { min_value: 1, max_value: 5 }
    smsText += `\n(Reply with a number from ${scale.min_value} to ${scale.max_value})`
  }
  return smsText
}

// Helper to complete the survey and store results
const completeSurvey = async (supabase: SupabaseClient, session: any, questions: any[], organizationId: string, thankYouMessage: string) => {
    console.log(`Completing survey for session ${session.id}`);

    // Create a feedback session
    const { data: feedbackSession, error: fbSessionError } = await supabase
        .from('feedback_sessions')
        .insert({
            organization_id: organizationId,
            status: 'completed',
            completed_at: new Date().toISOString(),
            phone_number: session.phone_number,
            sms_session_id: session.id,
        })
        .select('id')
        .single();
    if (fbSessionError) throw fbSessionError;

    const responses = session.responses || {};
    const feedbackResponses = Object.entries(responses).map(([questionId, value]) => {
        const question = questions.find(q => q.id === questionId);
        return {
            question_id: questionId,
            session_id: feedbackSession.id,
            organization_id: organizationId,
            response_value: value,
            question_category: question?.category || 'Comments',
        };
    });
    
    if (feedbackResponses.length > 0) {
        const { error: responseInsertError } = await supabase
            .from('feedback_responses')
            .insert(feedbackResponses);
        if (responseInsertError) throw responseInsertError;
    }

    // Mark SMS session as completed
    await supabase.from('sms_sessions').update({ status: 'completed' }).eq('id', session.id);

    return new Response(`END ${thankYouMessage}`, { headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const url = new URL(req.url)
    const webhookSecret = url.pathname.split('/').pop()

    if (!webhookSecret) {
      console.warn("Webhook called without secret.")
      return new Response('END Invalid request. Secret missing.', { headers: { ...corsHeaders, 'Content-Type': 'text/plain' }, status: 400 })
    }

    // 1. Find organization by webhook secret
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, slug, thank_you_message')
      .eq('webhook_secret', webhookSecret)
      .single()

    if (orgError || !org) {
      console.error(`Webhook error: Organization not found for secret ${webhookSecret}`, orgError)
      return new Response('END Service configuration error.', { headers: { ...corsHeaders, 'Content-Type': 'text/plain' }, status: 404 })
    }
    const organizationId = org.id

    // 2. Parse incoming data from Africa's Talking
    const formData = await req.formData();
    const from = formData.get('from') as string | null;
    let text = formData.get('text') as string | null;
    
    text = text === null ? '' : text.trim();

    if (!from) {
      console.warn("Webhook received request without a 'from' number.")
      return new Response('END Could not identify your phone number.', { headers: { ...corsHeaders, 'Content-Type': 'text/plain' }, status: 400 })
    }

    // 3. Fetch all active questions for the survey
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*, question_options(*), question_scale_config(*)')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('order_index')

    if (questionsError || !questions || questions.length === 0) {
      console.error(`No questions found for org ${organizationId}`, questionsError)
      return new Response('END No survey is currently available. Please try again later.', { headers: { ...corsHeaders, 'Content-Type': 'text/plain' } })
    }

    // 4. Find active SMS session or create a new one
    let { data: session, error: sessionError } = await supabase
      .from('sms_sessions')
      .select('*')
      .eq('phone_number', from)
      .eq('organization_id', organizationId)
      .in('status', ['started', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // --- START NEW SESSION ---
    if (!session) {
      if (text.toUpperCase() === 'STOP') {
        return new Response('END You have been unsubscribed.', { headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
      }

      const { data: newSession, error: createSessionError } = await supabase
        .from('sms_sessions')
        .insert({
          phone_number: from,
          organization_id: organizationId,
          status: 'in_progress',
          current_question_index: 0,
          responses: {},
        })
        .select()
        .single()

      if (createSessionError) throw createSessionError

      session = newSession
      const firstQuestion = questions[0]
      const smsResponse = formatQuestionForSms(firstQuestion)

      console.log(`New session ${session.id} for ${from}. Sending first question.`)
      return new Response(`CON ${smsResponse}`, { headers: { ...corsHeaders, 'Content-Type': 'text/plain' } })
    }

    // --- PROCESS ONGOING SESSION ---
    if (text.toUpperCase() === 'STOP') {
        await supabase.from('sms_sessions').update({ status: 'completed' }).eq('id', session.id);
        return new Response('END You have stopped the survey. Thank you.', { headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
    }
    
    const currentQuestionIndex = session.current_question_index
    const currentQuestion = questions[currentQuestionIndex]

    if (!currentQuestion) {
      return completeSurvey(supabase, session, questions, organizationId, org.thank_you_message || 'Thank you for your feedback!');
    }

    const updatedResponses = session.responses || {}
    updatedResponses[currentQuestion.id] = text

    const nextQuestionIndex = currentQuestionIndex + 1

    const { data: updatedSession, error: updateError } = await supabase
      .from('sms_sessions')
      .update({
        current_question_index: nextQuestionIndex,
        responses: updatedResponses,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      })
      .eq('id', session.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    session = updatedSession;

    if (nextQuestionIndex >= questions.length) {
      return completeSurvey(supabase, session, questions, organizationId, org.thank_you_message || 'Thank you for your feedback!');
    }

    const nextQuestion = questions[nextQuestionIndex]
    const smsResponse = formatQuestionForSms(nextQuestion)

    console.log(`Session ${session.id} for ${from}. Sending question ${nextQuestionIndex + 1}.`)
    return new Response(`CON ${smsResponse}`, { headers: { ...corsHeaders, 'Content-Type': 'text/plain' } })

  } catch (error) {
    console.error('Fatal error in handle-sms-webhook:', error.message, error.stack)
    return new Response('END An unexpected error occurred. Please try again later.', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    })
  }
})
