
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
    // Create a client with user's context to check auth and admin status
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
    
    // Create admin client to perform privileged database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { user_id, organization_id, role, email } = await req.json();

    if (!user_id || !organization_id || !role || !email) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: user_id, organization_id, role, email.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const { data: existingMembership, error: checkError } = await supabaseAdmin
      .from('organization_users')
      .select('id, organizations ( name )')
      .eq('user_id', user_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingMembership) {
      const orgName = existingMembership.organizations?.name || 'another organization';
      return new Response(JSON.stringify({ error: `User is already a member of ${orgName}. A user can only belong to one organization.` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409, // Conflict
      });
    }

    const { data: newMembership, error: insertError } = await supabaseAdmin
      .from('organization_users')
      .insert({
        user_id,
        organization_id,
        role,
        email,
        status: 'active',
        accepted_at: new Date().toISOString(),
        invited_by_user_id: user.id
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, membership: newMembership }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
