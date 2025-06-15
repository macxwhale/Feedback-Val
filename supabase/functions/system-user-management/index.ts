
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This function can only be called by authenticated super-admins.
// It returns a list of all users and pending invitations across all organizations.

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Check if user is a super admin
    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('get_current_user_admin_status');
    
    if (isAdminError) {
      throw isAdminError;
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'You must be a system admin to access this resource.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    
    // Fetch all users
    const { data: users, error: usersError } = await supabaseClient
      .from('organization_users')
      .select(`
        id,
        user_id,
        email,
        role,
        status,
        created_at,
        accepted_at,
        organization_id,
        invited_by_user_id,
        organizations (name, slug)
      `)
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;

    // Fetch all pending invitations
    const { data: invitations, error: invitationsError } = await supabaseClient
      .from('user_invitations')
      .select(`
        id,
        email,
        role,
        status,
        created_at,
        expires_at,
        organization_id,
        invited_by_user_id,
        organizations (name, slug)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (invitationsError) throw invitationsError;

    return new Response(JSON.stringify({ users, invitations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

