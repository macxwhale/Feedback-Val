
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

interface InviteUserRequest {
  email: string;
  organizationId: string;
  role: string;
  enhancedRole?: string;
}

serve(async (req: Request) => {
  console.log('Invite user to organization function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Authentication required' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 401
      });
    }

    // Create Supabase clients
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } }
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid authentication' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 401
      });
    }

    // Parse request body
    const { email, organizationId, role, enhancedRole }: InviteUserRequest = await req.json();

    // Validate input
    if (!email || !organizationId || !role) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: email, organizationId, role' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Check if current user has permission to invite users to this organization
    const { data: userOrgData, error: userOrgError } = await supabaseAdmin
      .from('organization_users')
      .select('role, enhanced_role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .single();

    if (userOrgError || !userOrgData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'You are not authorized to invite users to this organization' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 403
      });
    }

    // Check if user has admin permissions
    const isAdmin = userOrgData.role === 'admin' || 
                   ['owner', 'admin', 'manager'].includes(userOrgData.enhanced_role);
    
    if (!isAdmin) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'You need admin permissions to invite users' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 403
      });
    }

    // Get organization details
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('name, slug')
      .eq('id', organizationId)
      .single();

    if (orgError || !orgData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Organization not found' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 404
      });
    }

    // Check if user already exists in this organization
    const { data: existingMember } = await supabaseAdmin
      .from('organization_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (existingMember) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User is already a member of this organization' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Check if there's already a pending invitation
    const { data: existingInvitation } = await supabaseAdmin
      .from('user_invitations')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .eq('organization_id', organizationId)
      .in('status', ['pending', 'sent', 'delivered', 'opened', 'resent'])
      .maybeSingle();

    if (existingInvitation) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'An invitation is already pending for this email' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Create invitation record
    const { data: invitationData, error: invitationError } = await supabaseAdmin
      .from('user_invitations')
      .insert({
        email: email.toLowerCase(),
        organization_id: organizationId,
        role: role,
        enhanced_role: enhancedRole || 'member',
        invited_by_user_id: user.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select('id, invitation_token')
      .single();

    if (invitationError || !invitationData) {
      console.error('Error creating invitation:', invitationError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to create invitation' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      });
    }

    // Log invitation creation event
    await supabaseAdmin.rpc('log_invitation_event', {
      p_invitation_id: invitationData.id,
      p_event_type: 'created',
      p_event_data: { role, enhanced_role, invited_by: user.id }
    });

    // Send invitation email
    const baseUrl = req.headers.get('origin') || 'https://pulsify.co.ke';
    const invitationUrl = `${baseUrl}/invitation/accept?token=${invitationData.invitation_token}`;

    // Here you would integrate with your email service (Resend, etc.)
    // For now, we'll just log it and return success
    console.log('Invitation URL:', invitationUrl);
    console.log('Sending invitation email to:', email);

    // Update invitation status to 'sent'
    await supabaseAdmin
      .from('user_invitations')
      .update({ status: 'sent' })
      .eq('id', invitationData.id);

    // Log sent event
    await supabaseAdmin.rpc('log_invitation_event', {
      p_invitation_id: invitationData.id,
      p_event_type: 'sent',
      p_event_data: { invitation_url: invitationUrl }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Invitation sent successfully',
      invitation_id: invitationData.id,
      type: 'invitation_sent'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200
    });

  } catch (error) {
    console.error('Error in invite-user-to-organization:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An unexpected error occurred' 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
});
