
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

serve(async (req: Request) => {
  console.log('Accept invitation function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, password } = await req.json();
    
    if (!token || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('user_invitations')
      .select(`
        id,
        email,
        organization_id,
        role,
        enhanced_role,
        expires_at,
        status,
        invited_by_user_id,
        organizations (
          name,
          slug
        )
      `)
      .eq('invitation_token', token)
      .single();

    if (inviteError || !invitation) {
      console.error('Invitation not found:', inviteError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid invitation token' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invitation has expired' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check if invitation is in valid status
    if (!['pending', 'sent', 'delivered', 'opened', 'resent'].includes(invitation.status)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invitation is no longer valid' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === invitation.email);

    let userId: string;

    if (existingUser) {
      // User exists, update their password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );

      if (updateError) {
        console.error('Error updating user password:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update password' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password,
        email_confirm: true
      });

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user account' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      userId = newUser.user.id;
    }

    // Check if user is already in organization
    const { data: existingOrgUser } = await supabaseAdmin
      .from('organization_users')
      .select('user_id')
      .eq('user_id', userId)
      .eq('organization_id', invitation.organization_id)
      .maybeSingle();

    if (!existingOrgUser) {
      // Add user to organization
      const { error: addOrgError } = await supabaseAdmin
        .from('organization_users')
        .insert({
          user_id: userId,
          organization_id: invitation.organization_id,
          email: invitation.email,
          role: invitation.role,
          enhanced_role: invitation.enhanced_role,
          status: 'active',
          invited_by_user_id: invitation.invited_by_user_id,
          accepted_at: new Date().toISOString()
        });

      if (addOrgError) {
        console.error('Error adding user to organization:', addOrgError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to add user to organization' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Update invitation status
    await supabaseAdmin
      .from('user_invitations')
      .update({ 
        status: 'accepted', 
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    // Sign in the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: invitation.email,
      password
    });

    if (signInError || !signInData.session) {
      console.error('Error signing in user:', signInError);
      return new Response(
        JSON.stringify({ success: false, error: 'Account created but failed to sign in. Please try logging in manually.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation accepted successfully',
        session: signInData.session,
        organizationSlug: invitation.organizations?.slug,
        redirectTo: `/admin/${invitation.organizations?.slug}`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Error in accept-invitation:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
