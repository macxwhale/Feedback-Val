
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

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

function createErrorResponse(message: string, status: number = 400) {
  console.error('API Error:', message);
  return new Response(JSON.stringify({ error: message }), {
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

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return createErrorResponse('Authentication required', 401);
    }

    // Get user's organization
    const { data: orgUser, error: orgError } = await supabase
      .from('organization_users')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (orgError || !orgUser) {
      return createErrorResponse('No active organization access found', 403);
    }

    const organizationId = orgUser.organization_id;
    const { method } = req;

    console.log('Questions CRUD called:', { method, userId: user.id, organizationId });

    switch (method) {
      case 'GET': {
        const { data, error } = await supabase
          .from('questions')
          .select(`
            *,
            question_options(*),
            question_scale_config(*)
          `)
          .eq('organization_id', organizationId)
          .order('order_index');
        
        if (error) {
          console.error('Database error:', error);
          return createErrorResponse('Failed to fetch questions', 500);
        }

        console.log(`Fetched ${data?.length || 0} questions`);
        return new Response(JSON.stringify(data || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'POST': {
        const body: QuestionData = await req.json();
        
        if (!body.question_text?.trim()) {
          return createErrorResponse('Question text is required');
        }

        // Insert question
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert({
            question_text: body.question_text,
            question_type: body.question_type,
            category: body.category,
            order_index: body.order_index,
            help_text: body.help_text,
            placeholder_text: body.placeholder_text,
            is_required: body.is_required || false,
            organization_id: organizationId,
            type_id: '00000000-0000-0000-0000-000000000000', // Placeholder
            category_id: '00000000-0000-0000-0000-000000000000' // Placeholder
          })
          .select()
          .single();
        
        if (questionError) {
          console.error('Question creation error:', questionError);
          return createErrorResponse('Failed to create question', 500);
        }

        // Create options if provided
        if (body.options?.length) {
          const optionsData = body.options.map((option, index) => ({
            question_id: question.id,
            option_text: option.text,
            option_value: option.value || option.text,
            display_order: index + 1
          }));

          const { error: optionsError } = await supabase
            .from('question_options')
            .insert(optionsData);
          
          if (optionsError) {
            console.error('Options creation error:', optionsError);
          }
        }

        // Create scale config if provided
        if (body.scaleConfig) {
          const { error: scaleError } = await supabase
            .from('question_scale_config')
            .insert({
              question_id: question.id,
              min_value: body.scaleConfig.minValue,
              max_value: body.scaleConfig.maxValue,
              min_label: body.scaleConfig.minLabel,
              max_label: body.scaleConfig.maxLabel,
              step_size: body.scaleConfig.stepSize || 1
            });
          
          if (scaleError) {
            console.error('Scale config creation error:', scaleError);
          }
        }

        return new Response(JSON.stringify(question), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'PUT': {
        const body: QuestionData & { id: string } = await req.json();
        const { id, options, scaleConfig, ...updates } = body;
        
        if (!id) {
          return createErrorResponse('Question ID is required');
        }

        // Update question
        const { data: question, error: updateError } = await supabase
          .from('questions')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', organizationId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Question update error:', updateError);
          return createErrorResponse('Failed to update question', 500);
        }

        // Update options
        if (options !== undefined) {
          await supabase.from('question_options').delete().eq('question_id', id);
          
          if (options.length > 0) {
            const optionsData = options.map((option, index) => ({
              question_id: id,
              option_text: option.text,
              option_value: option.value || option.text,
              display_order: index + 1
            }));

            await supabase.from('question_options').insert(optionsData);
          }
        }

        // Update scale config
        if (scaleConfig) {
          await supabase.from('question_scale_config').delete().eq('question_id', id);
          await supabase.from('question_scale_config').insert({
            question_id: id,
            min_value: scaleConfig.minValue,
            max_value: scaleConfig.maxValue,
            min_label: scaleConfig.minLabel,
            max_label: scaleConfig.maxLabel,
            step_size: scaleConfig.stepSize || 1
          });
        }

        return new Response(JSON.stringify(question), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'DELETE': {
        const { id } = await req.json();
        
        if (!id) {
          return createErrorResponse('Question ID is required');
        }

        // Delete related data first
        await supabase.from('question_options').delete().eq('question_id', id);
        await supabase.from('question_scale_config').delete().eq('question_id', id);
        
        // Delete question
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('id', id)
          .eq('organization_id', organizationId);
        
        if (error) {
          console.error('Question deletion error:', error);
          return createErrorResponse('Failed to delete question', 500);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return createErrorResponse('Method not allowed', 405);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
