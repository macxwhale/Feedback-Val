import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, User } from 'https://esm.sh/@supabase/supabase-js@2';

console.log("`admin-approve-invitations` function initialized.");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log(`[admin-approve-invitations] Received request with method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    console.log("[admin-approve-invitations] Handling OPTIONS request.");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("[admin-approve-invitations] Processing request...");
    // 1. Check for admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    console.log("[admin-approve-invitations] Checking admin status...");
    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('get_current_user_admin_status');
    if (isAdminError) {
        console.error("[admin-approve-invitations] Error checking admin status:", isAdminError.message);
        throw isAdminError;
    }
    if (!isAdmin) {
      console.warn("[admin-approve-invitations] Unauthorized access attempt.");
      return new Response(JSON.stringify({ error: 'You must be a system admin to perform this action.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }
    console.log("[admin-approve-invitations] Admin status confirmed.");

    // Use admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // 2. Get all pending invitations
    console.log("[admin-approve-invitations] Fetching pending invitations...");
    const { data: invitations, error: invitationsError } = await supabaseAdmin
      .from('user_invitations')
      .select('*')
      .eq('status', 'pending');

    if (invitationsError) {
        console.error("[admin-approve-invitations] Error fetching invitations:", invitationsError.message);
        throw invitationsError;
    }
    console.log(`[admin-approve-invitations] Found ${invitations?.length || 0} pending invitations.`);


    if (!invitations || invitations.length === 0) {
      return new Response(JSON.stringify({ approvedCount: 0, failedCount: 0, message: "No pending invitations to approve." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    let approvedCount = 0;
    let failedCount = 0;

    // Fetch all users from auth schema
    console.log("[admin-approve-invitations] Fetching all system users...");
    let allUsers: User[] = [];
    let page = 1;
    while (true) {
        const { data: { users: userBatch }, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) {
            console.error("[admin-approve-invitations] Error fetching users:", error.message);
            throw error;
        }
        allUsers.push(...userBatch);
        if (userBatch.length < 1000) break;
        page++;
    }
    const userMap = new Map(allUsers.map(u => [u.email, u.id]));
    console.log(`[admin-approve-invitations] Fetched ${allUsers.length} total users.`);
    
    for (const invitation of invitations) {
        console.log(`[admin-approve-invitations] Processing invitation for ${invitation.email}`);
        const userId = userMap.get(invitation.email);

        if (!userId) {
            console.log(`[admin-approve-invitations] User ${invitation.email} not found. Skipping.`);
            failedCount++;
            continue; // User does not exist, cannot approve.
        }

        // Check if user is already a member of ANY organization
        const { data: existingMembership, error: checkError } = await supabaseAdmin
            .from('organization_users')
            .select('id, organization_id')
            .eq('user_id', userId)
            .maybeSingle();

        if (checkError) {
            console.error(`Error checking membership for ${invitation.email}:`, checkError.message);
            failedCount++;
            continue;
        }

        if (existingMembership) {
            if (existingMembership.organization_id === invitation.organization_id) {
                // User is already a member of this specific organization. Silently accept the invitation.
                console.log(`[admin-approve-invitations] User ${invitation.email} is already a member of this org. Marking invitation as accepted.`);
                await supabaseAdmin
                    .from('user_invitations')
                    .update({ status: 'accepted', updated_at: new Date().toISOString() })
                    .eq('id', invitation.id);
                approvedCount++;
            } else {
                // User is a member of a different organization. We cannot approve this.
                console.log(`[admin-approve-invitations] User ${invitation.email} is a member of another org. Cancelling invitation.`);
                await supabaseAdmin
                    .from('user_invitations')
                    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
                    .eq('id', invitation.id);
                failedCount++;
            }
            continue;
        }

        // Add user to organization
        console.log(`[admin-approve-invitations] Adding user ${invitation.email} to organization ${invitation.organization_id}.`);
        const { error: insertError } = await supabaseAdmin
            .from('organization_users')
            .insert({
                user_id: userId,
                organization_id: invitation.organization_id,
                role: invitation.role,
                email: invitation.email,
                status: 'active',
                accepted_at: new Date().toISOString(),
                invited_by_user_id: invitation.invited_by_user_id
            });

        if (insertError) {
            console.error(`Error inserting user ${invitation.email} into org:`, insertError.message);
            failedCount++;
            continue;
        }
        
        // Update invitation status
        const { error: updateError } = await supabaseAdmin
            .from('user_invitations')
            .update({ status: 'accepted', updated_at: new Date().toISOString() })
            .eq('id', invitation.id);

        if (updateError) {
            console.error(`Error updating invitation for ${invitation.email}:`, updateError.message);
            failedCount++;
        } else {
            console.log(`[admin-approve-invitations] Successfully approved invitation for ${invitation.email}.`);
            approvedCount++;
        }
    }

    console.log(`[admin-approve-invitations] Processing complete. Approved: ${approvedCount}, Failed: ${failedCount}.`);
    return new Response(JSON.stringify({ approvedCount, failedCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(`[admin-approve-invitations] Unhandled error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
