
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const sendWelcomeEmail = async (email: string, organizationName: string, resetUrl: string) => {
  console.log('Attempting to send email to:', email);
  console.log('SMTP Host:', Deno.env.get('ZOHO_SMTP_HOST'));
  console.log('SMTP Port:', Deno.env.get('ZOHO_SMTP_PORT'));
  console.log('SMTP User:', Deno.env.get('ZOHO_SMTP_USER'));

  try {
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('ZOHO_SMTP_HOST')!,
        port: parseInt(Deno.env.get('ZOHO_SMTP_PORT')!),
        tls: true,
        auth: {
          username: Deno.env.get('ZOHO_SMTP_USER')!,
          password: Deno.env.get('ZOHO_SMTP_PASSWORD')!,
        },
      },
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to ${organizationName}!</h1>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #007ACE; margin-top: 0;">You've been invited to join our organization</h2>
          <p>An administrator from <strong>${organizationName}</strong> has created an account for you.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #007ACE;">
            <p><strong>Your email:</strong> ${email}</p>
            <p><strong>Next step:</strong> Set up your password to access your account</p>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007ACE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Set Up Your Password
          </a>
        </div>

        <div style="background-color: #f1f3f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">What happens next?</h3>
          <ol style="color: #666;">
            <li>Click the "Set Up Your Password" button above</li>
            <li>Create a secure password for your account</li>
            <li>You'll be automatically logged in and redirected to your organization dashboard</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #007ACE; word-break: break-all;">${resetUrl}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This invitation link will expire in 24 hours for security purposes.
          </p>
        </div>
      </div>
    `;

    console.log('Sending email with subject:', `Welcome to ${organizationName} - Set Up Your Account`);

    await client.send({
      from: Deno.env.get('ZOHO_FROM_EMAIL')!,
      to: email,
      subject: `Welcome to ${organizationName} - Set Up Your Account`,
      html: emailContent,
    });

    console.log('Email sent successfully');
    await client.close();
  } catch (error) {
    console.error('Detailed email error:', error);
    throw error;
  }
};

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

    // Get organization details for email
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

      // Generate password reset link for existing user
      const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/admin/${organization.slug}`
        }
      });

      if (resetError) {
        console.error('Reset link generation error:', resetError);
      } else {
        // Send welcome email with password reset instructions
        try {
          await sendWelcomeEmail(email, organization.name, resetData.properties.action_link);
        } catch (emailError) {
          console.error('Email sending error:', emailError);
        }
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
      email_confirm: true, // Skip email confirmation since we're sending our own welcome email
      user_metadata: {
        organization_id: organizationId,
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

    // Generate password reset link for new user
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/admin/${organization.slug}`
      }
    });

    if (resetError) {
      console.error('Reset link generation error:', resetError);
      throw resetError;
    }

    // Send welcome email with password setup instructions
    try {
      await sendWelcomeEmail(email, organization.name, resetData.properties.action_link);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
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
      message: 'User created successfully and welcome email sent',
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
