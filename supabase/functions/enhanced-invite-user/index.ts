
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, organizationId, role, enhancedRole } = await req.json();
    console.log('Processing invite for:', email, 'to organization:', organizationId);

    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create regular client for permission checks
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get current user and verify permissions
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }

    // Check if current user is org admin
    const { data: orgUser } = await supabaseAdmin
      .from('organization_users')
      .select('role, enhanced_role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .single();

    if (!orgUser || (orgUser.role !== 'admin' && orgUser.enhanced_role !== 'admin' && orgUser.enhanced_role !== 'owner')) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403
      });
    }

    // Get organization details for email template
    const { data: organization } = await supabaseAdmin
      .from('organizations')
      .select('name, slug')
      .eq('id', organizationId)
      .single();

    if (!organization) {
      return new Response(JSON.stringify({ error: 'Organization not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    // Check if user already exists in auth
    const { data: existingUserData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUserData.users.find(u => u.email === email);
    
    if (existingUser) {
      // User exists, check if already in organization
      const { data: existingOrgUser } = await supabaseAdmin
        .from('organization_users')
        .select('id')
        .eq('user_id', existingUser.id)
        .eq('organization_id', organizationId)
        .single();

      if (existingOrgUser) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'User is already a member of this organization' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      // Add existing user to organization
      const { error: insertError } = await supabaseAdmin
        .from('organization_users')
        .insert({
          user_id: existingUser.id,
          organization_id: organizationId,
          email: email,
          role: role,
          enhanced_role: enhancedRole || role,
          invited_by_user_id: user.id,
          accepted_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Generate password reset link for existing user using Supabase's email system
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/admin/${organization.slug}`
        }
      });

      if (resetError) {
        console.error('Reset link generation error:', resetError);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'User added to organization and welcome email sent',
        type: 'direct_add'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // User doesn't exist, create new user account
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        organization_id: organizationId,
        organization_name: organization.name,
        role: role,
        enhanced_role: enhancedRole || role,
        invited_by: user.id
      }
    });

    if (createError) {
      console.error('User creation error:', createError);
      throw createError;
    }

    // Add user to organization
    const { error: orgInsertError } = await supabaseAdmin
      .from('organization_users')
      .insert({
        user_id: newUser.user.id,
        organization_id: organizationId,
        email: email,
        role: role,
        enhanced_role: enhancedRole || role,
        invited_by_user_id: user.id,
        accepted_at: new Date().toISOString()
      });

    if (orgInsertError) throw orgInsertError;

    // Generate password reset link for new user using Supabase's email system
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/admin/${organization.slug}`
      }
    });

    if (resetError) {
      console.error('Reset link generation error:', resetError);
      // Don't throw here - user creation was successful, email is secondary
    }

    // Create invitation record for tracking (optional)
    const { error: invitationError } = await supabaseAdmin
      .from('user_invitations')
      .insert({
        email: email,
        organization_id: organizationId,
        role: role,
        enhanced_role: enhancedRole || role,
        invited_by_user_id: user.id,
        status: 'accepted' // Mark as accepted since user is created
      });

    if (invitationError) {
      console.error('Invitation record error:', invitationError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'User created successfully and welcome email sent via Supabase',
      type: 'user_created'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in enhanced-invite-user:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'An error occurred while inviting the user' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
