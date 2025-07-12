
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const createResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    status
  });
};

serve(async (req: Request) => {
  console.log('Enhanced invite function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid authorization header');
      return createResponse({ 
        success: false, 
        error: 'Authentication required' 
      }, 401);
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Authenticate user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return createResponse({ success: false, error: 'Invalid authentication token' }, 401);
    }

    // Parse and validate request body
    let body;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      body = JSON.parse(bodyText);
      console.log('Parsed body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return createResponse({ 
        success: false, 
        error: 'Invalid request body - must be valid JSON' 
      }, 400);
    }

    const { email, organizationId, role, enhancedRole } = body;

    if (!email || !organizationId || !role) {
      return createResponse({ 
        success: false, 
        error: 'Missing required fields: email, organizationId, and role are required' 
      }, 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return createResponse({ 
        success: false, 
        error: 'Please provide a valid email address' 
      }, 400);
    }

    // Check if current user has permission to invite
    const { data: orgUser, error: permissionError } = await supabaseClient
      .from('organization_users')
      .select('enhanced_role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .single();

    if (permissionError || !orgUser) {
      console.error('Permission check failed:', permissionError);
      return createResponse({
        success: false,
        error: 'You are not a member of this organization or do not have permission to invite users'
      }, 403);
    }

    const allowedRoles = ['manager', 'admin', 'owner'];
    if (!allowedRoles.includes(orgUser.enhanced_role)) {
      console.error('Insufficient permissions. User role:', orgUser.enhanced_role);
      return createResponse({
        success: false,
        error: 'You need manager-level access or higher to invite users'
      }, 403);
    }

    // Create admin client for invitation operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get organization details
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, name, slug')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      console.error('Organization not found:', orgError);
      return createResponse({ success: false, error: 'Organization not found' }, 404);
    }

    // Check if user already exists in auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === email.toLowerCase().trim());

    if (existingUser) {
      // Check if user is already in organization
      const { data: existingOrgUser } = await supabaseAdmin
        .from('organization_users')
        .select('user_id')
        .eq('user_id', existingUser.id)
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (existingOrgUser) {
        console.log('User is already a member of this organization');
        return createResponse({
          success: false,
          error: 'User is already a member of this organization'
        }, 400);
      }

      // Add existing user directly to organization
      const { error: addError } = await supabaseAdmin
        .from('organization_users')
        .insert({
          user_id: existingUser.id,
          organization_id: organizationId,
          email: email.toLowerCase().trim(),
          role: role,
          enhanced_role: enhancedRole || role,
          status: 'active',
          invited_by_user_id: user.id,
          accepted_at: new Date().toISOString()
        });

      if (addError) {
        console.error('Error adding existing user to organization:', addError);
        return createResponse({
          success: false,
          error: 'Failed to add user to organization. Please try again.'
        }, 500);
      }

      console.log('Existing user added to organization successfully');
      return createResponse({
        success: true,
        message: 'User successfully added to organization.',
        type: 'direct_add'
      });
    }

    // Check for existing invitation
    const { data: existingInvitation } = await supabaseAdmin
      .from('user_invitations')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .eq('organization_id', organizationId)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingInvitation) {
      console.log('Existing invitation found');
      return createResponse({
        success: false,
        error: 'An invitation is already pending for this email address'
      }, 400);
    }

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('user_invitations')
      .insert({
        email: email.toLowerCase().trim(),
        organization_id: organizationId,
        role: role,
        enhanced_role: enhancedRole || role,
        invited_by_user_id: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Failed to create invitation:', inviteError);
      return createResponse({
        success: false,
        error: 'Failed to create invitation. Please try again.'
      }, 500);
    }

    // Send invitation email using Supabase Auth
    const baseUrl = req.headers.get('origin') || 'https://pulsify.co.ke';
    const redirectUrl = `${baseUrl}/invitation/accept?token=${invitation.invitation_token}`;
    
    console.log('Using redirect URL for invitation:', redirectUrl);

    const { data: inviteResponse, error: emailError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email.toLowerCase().trim(),
      {
        redirectTo: redirectUrl,
        data: {
          organization_name: organization.name,
          organization_slug: organization.slug,
          organization_id: organization.id,
          role: role,
          enhanced_role: enhancedRole || role,
          inviter_email: user.email || 'system',
          invitation_type: 'organization_invite',
          invitation_token: invitation.invitation_token
        }
      }
    );

    if (emailError) {
      console.error('Failed to send invitation email:', emailError);
      
      // Update invitation status to indicate email failed
      await supabaseAdmin
        .from('user_invitations')
        .update({ status: 'email_failed' })
        .eq('id', invitation.id);
      
      return createResponse({
        success: false,
        error: 'Failed to send invitation email. Please check the email address and try again.'
      }, 500);
    }

    console.log('Invitation sent successfully');
    return createResponse({
      success: true,
      message: 'Invitation sent successfully! The user will receive an email to join the organization.',
      type: 'invitation_sent',
      invitation_id: invitation.id
    });

  } catch (error) {
    console.error('Error in enhanced-invite-user:', error);
    return createResponse({ 
      success: false, 
      error: 'An unexpected error occurred while sending the invitation. Please try again.' 
    }, 500);
  }
});
