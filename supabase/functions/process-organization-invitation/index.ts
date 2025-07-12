
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

interface ProcessInvitationRequest {
  invitationToken: string;
}

serve(async (req: Request) => {
  console.log('Process organization invitation function called');
  
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
    const { invitationToken }: ProcessInvitationRequest = await req.json();

    if (!invitationToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invitation token is required' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Validate invitation token
    const { data: validationData, error: validationError } = await supabaseAdmin
      .rpc('validate_invitation_token', { p_token: invitationToken });

    if (validationError || !validationData || validationData.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to validate invitation' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      });
    }

    const invitation = validationData[0];
    
    if (!invitation.is_valid) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: invitation.error_message || 'Invalid invitation' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Check if the current user's email matches the invitation email
    if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'This invitation is for a different email address' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Check if user is already a member of this organization
    const { data: existingMember } = await supabaseAdmin
      .from('organization_users')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', invitation.organization_id)
      .maybeSingle();

    if (existingMember) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'You are already a member of this organization' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Add user to organization
    const { error: addUserError } = await supabaseAdmin
      .from('organization_users')
      .insert({
        user_id: user.id,
        organization_id: invitation.organization_id,
        email: user.email,
        role: invitation.role,
        enhanced_role: invitation.enhanced_role,
        status: 'active',
        accepted_at: new Date().toISOString()
      });

    if (addUserError) {
      console.error('Error adding user to organization:', addUserError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to add user to organization' 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      });
    }

    // Update invitation status to 'accepted'
    const { error: updateInvitationError } = await supabaseAdmin
      .from('user_invitations')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.invitation_id);

    if (updateInvitationError) {
      console.error('Error updating invitation status:', updateInvitationError);
    }

    // Log invitation acceptance event
    await supabaseAdmin.rpc('log_invitation_event', {
      p_invitation_id: invitation.invitation_id,
      p_event_type: 'accepted',
      p_event_data: { user_id: user.id, accepted_at: new Date().toISOString() }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully joined organization',
      organization: {
        id: invitation.organization_id,
        name: invitation.organization_name,
        slug: invitation.organization_slug
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200
    });

  } catch (error) {
    console.error('Error in process-organization-invitation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An unexpected error occurred' 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
});
