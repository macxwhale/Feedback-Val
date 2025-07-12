
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InvitationData {
  invitation_id: string;
  email: string;
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  role: string;
  enhanced_role: string;
  expires_at: string;
  is_valid: boolean;
  error_message?: string;
}

interface AcceptInvitationResult {
  success: boolean;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  error?: string;
}

export const useInvitationAcceptance = () => {
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  const validateInvitation = async (token: string): Promise<InvitationData | null> => {
    try {
      setValidating(true);
      const { data, error } = await supabase.rpc('validate_invitation_token', {
        p_token: token
      });

      if (error) {
        console.error('Error validating invitation:', error);
        toast.error('Failed to validate invitation');
        return null;
      }

      if (!data || data.length === 0) {
        toast.error('Invalid invitation token');
        return null;
      }

      const invitation = data[0];
      
      if (!invitation.is_valid) {
        toast.error(invitation.error_message || 'Invalid invitation');
        return null;
      }

      return invitation;
    } catch (error) {
      console.error('Error validating invitation:', error);
      toast.error('An unexpected error occurred while validating invitation');
      return null;
    } finally {
      setValidating(false);
    }
  };

  const acceptInvitation = async (token: string): Promise<AcceptInvitationResult> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('process-organization-invitation', {
        body: { invitationToken: token }
      });

      if (error) {
        console.error('Error processing invitation:', error);
        const errorMessage = 'Failed to process invitation';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (data?.success) {
        toast.success(`Successfully joined ${data.organization.name}!`);
        return {
          success: true,
          organization: data.organization
        };
      } else {
        const errorMessage = data?.error || 'Failed to accept invitation';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      const errorMessage = 'An unexpected error occurred';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    validateInvitation,
    acceptInvitation,
    loading,
    validating
  };
};
