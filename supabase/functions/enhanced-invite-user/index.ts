
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
      console.log('No authenticated user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }

    console.log('Current user ID:', user.id);

    // Check if current user is org admin
    const { data: orgUser } = await supabaseAdmin
      .from('organization_users')
      .select('role, enhanced_role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .single();

    console.log('Current user org role:', orgUser);

    if (!orgUser || (orgUser.role !== 'admin' && orgUser.enhanced_role !== 'admin' && orgUser.enhanced_role !== 'owner')) {
      console.log('User lacks admin permissions');
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
      console.log('Organization not found');
      return new Response(JSON.stringify({ error: 'Organization not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    console.log('Organization found:', organization.name);

    // Check if user already exists in auth.users by querying organization_users first
    // This avoids the permission denied error we were getting
    const { data: existingOrgUser } = await supabaseAdmin
      .from('organization_users')
      .select('user_id')
      .eq('email', email)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (existingOrgUser) {
      console.log('User is already a member of this organization');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User is already a member of this organization' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Check if there's an existing user with this email across the system
    const { data: existingUserData, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();
    console.log('List users error:', listUsersError);
    console.log('Total users found:', existingUserData?.users?.length || 0);
    
    const existingUser = existingUserData?.users?.find(u => u.email === email);
    
    if (existingUser) {
      console.log('User already exists in auth, adding to organization...');
      
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

      if (insertError) {
        console.error('Error adding user to organization:', insertError);
        throw insertError;
      }

      console.log('User added to organization, generating password reset link...');

      // Generate password reset link for existing user with detailed logging
      console.log('Attempting to generate password reset link...');
      console.log('Email:', email);
      console.log('Redirect URL will be:', `${req.headers.get('origin') || 'https://pulsify.co.ke'}/admin/${organization.slug}`);
      
      const { data: resetLinkData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin') || 'https://pulsify.co.ke'}/admin/${organization.slug}`
        }
      });

      console.log('Generate link response - Data:', resetLinkData);
      console.log('Generate link response - Error:', resetError);

      if (resetError) {
        console.error('Password reset link generation error:', resetError);
        return new Response(JSON.stringify({
          success: false,
          error: `Failed to send invitation email: ${resetError.message}`,
          details: 'Password reset link generation failed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      } else {
        console.log('Password reset link generated successfully');
        console.log('Action link present:', resetLinkData.properties?.action_link ? 'Yes' : 'No');
        if (resetLinkData.properties?.action_link) {
          console.log('Action link:', resetLinkData.properties.action_link);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'User added to organization and invitation email sent',
        type: 'direct_add',
        debug: {
          emailGenerated: !!resetLinkData.properties?.action_link,
          resetLinkData: resetLinkData
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating new user account...');

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

    console.log('New user created successfully:', newUser.user.id);

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

    if (orgInsertError) {
      console.error('Error adding new user to organization:', orgInsertError);
      throw orgInsertError;
    }

    console.log('New user added to organization, generating password reset link...');

    // Generate password reset link for new user with detailed logging
    console.log('Attempting to generate password reset link for new user...');
    console.log('Email:', email);
    console.log('Redirect URL will be:', `${req.headers.get('origin') || 'https://pulsify.co.ke'}/admin/${organization.slug}`);
    
    const { data: resetLinkData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'https://pulsify.co.ke'}/admin/${organization.slug}`
      }
    });

    console.log('Generate link response - Data:', resetLinkData);
    console.log('Generate link response - Error:', resetError);

    if (resetError) {
      console.error('Reset link generation error:', resetError);
      return new Response(JSON.stringify({
        success: false,
        error: `User created but failed to send invitation email: ${resetError.message}`,
        details: 'Password reset link generation failed for new user'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    } else {
      console.log('Password reset link generated successfully for new user');
      console.log('Action link present:', resetLinkData.properties?.action_link ? 'Yes' : 'No');
      if (resetLinkData.properties?.action_link) {
        console.log('Action link:', resetLinkData.properties.action_link);
      }
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

    console.log('Invitation process completed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'User created successfully and invitation email sent',
      type: 'user_created',
      debug: {
        emailGenerated: !!resetLinkData.properties?.action_link,
        resetLinkData: resetLinkData
      }
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
