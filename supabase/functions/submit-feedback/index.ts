
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FeedbackSubmission {
  responses: Record<string, any>;
  organizationId: string;
  questions: any[];
  timingData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { responses, organizationId, questions, timingData }: FeedbackSubmission = await req.json()

    console.log('Processing feedback submission for org:', organizationId)

    const { data: org, error: orgError } = await supabaseClient
      .from('organizations')
      .select('id, name')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      throw new Error('Organization not found')
    }

    const { data: session, error: sessionError } = await supabaseClient
      .from('feedback_sessions')
      .insert({
        organization_id: organizationId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        started_at: timingData ? new Date(timingData.startTime).toISOString() : new Date().toISOString(),
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating feedback session:', sessionError)
      throw sessionError
    }

    console.log('Created session:', session.id)

    const responseData = Object.entries(responses).map(([questionId, value]) => {
      const question = questions.find(q => q.id === questionId)
      const score = Math.floor(Math.random() * 5) + 1
      
      const questionTiming = timingData?.questionTimes?.find((qt: any) => qt.questionId === questionId);

      return {
        question_id: questionId,
        session_id: session.id,
        organization_id: organizationId,
        response_value: value,
        question_category: question?.category || 'Comments',
        score: score,
        response_time_ms: questionTiming?.responseTime || null,
        question_started_at: questionTiming ? new Date(questionTiming.startTime).toISOString() : null,
        question_completed_at: questionTiming ? new Date(questionTiming.endTime).toISOString() : null,
      }
    })

    const { error: responsesError } = await supabaseClient
      .from('feedback_responses')
      .insert(responseData)

    if (responsesError) {
      console.error('Error storing responses:', responsesError)
      throw responsesError
    }

    const totalScore = responseData.reduce((sum, r) => sum + (r.score || 0), 0)
    
    const sessionUpdatePayload: {
      total_score: number;
      total_response_time_ms?: number;
      avg_question_time_ms?: number;
      timing_metadata?: any;
    } = {
      total_score: totalScore
    };

    if (timingData) {
      sessionUpdatePayload.total_response_time_ms = timingData.totalResponseTime;
      const validResponseTimes = timingData.questionTimes
        .map((q: any) => q.responseTime)
        .filter((rt: number) => rt > 0);
      
      if (validResponseTimes.length > 0) {
        sessionUpdatePayload.avg_question_time_ms = Math.round(
          validResponseTimes.reduce((a: number, b: number) => a + b, 0) / validResponseTimes.length
        );
      }
      sessionUpdatePayload.timing_metadata = timingData;
    }

    const { error: updateError } = await supabaseClient
      .from('feedback_sessions')
      .update(sessionUpdatePayload)
      .eq('id', session.id)

    if (updateError) {
      console.error('Error updating session score:', updateError)
    }

    console.log('Feedback submission completed successfully:', responseData.length, 'responses')

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: session.id,
        totalScore,
        responseCount: responseData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in submit-feedback function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
