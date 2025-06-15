
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // No development console.logs except on error/important state
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('get_current_user_admin_status');
    if (isAdminError) throw isAdminError;
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'You must be a system admin to perform this action.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { user_id, organization_id, role } = await req.json();

    if (!user_id || !organization_id || !role) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: user_id, organization_id, role.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const { data: updatedMembership, error: updateError } = await supabaseAdmin
      .from('organization_users')
      .update({
        organization_id,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: `User with ID ${user_id} not found in any organization.` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
      }
      console.error(`[assign-user-to-org] Unhandled update error: ${updateError.message}`);
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true, membership: updatedMembership }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Production error logging
    console.error(`[assign-user-to-org] Unhandled error:`, error && error.message ? error.message : error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
