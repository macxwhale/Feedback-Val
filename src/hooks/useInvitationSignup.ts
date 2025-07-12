
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignupWithInvitationParams {
  email: string;
  password: string;
  invitationToken: string;
  organizationId: string;
}

interface SignupResult {
  success: boolean;
  requiresEmailConfirmation?: boolean;
  error?: string;
}

export const useInvitationSignup = () => {
  const [loading, setLoading] = useState(false);

  const signupWithInvitation = async (params: SignupWithInvitationParams): Promise<SignupResult> => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/invitation/accept?token=${params.invitationToken}`;

      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            invitation_token: params.invitationToken,
            organization_id: params.organizationId
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Please check your email to confirm your account');
        return { 
          success: true, 
          requiresEmailConfirmation: true 
        };
      } else if (data.session) {
        // User is signed in immediately
        toast.success('Account created successfully!');
        return { success: true };
      }

      return { success: false, error: 'Unexpected signup result' };
    } catch (error) {
      console.error('Error during signup:', error);
      const errorMessage = 'An unexpected error occurred during signup';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    signupWithInvitation,
    loading
  };
};
