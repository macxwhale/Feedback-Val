
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InviteUserParams {
  email: string;
  organizationId: string;
  role: string;
}

interface CancelInvitationParams {
  invitationId: string;
}

interface RemoveUserParams {
  userId: string;
  organizationId: string;
}

interface InviteUserResponse {
  success: boolean;
  error?: string;
  message?: string;
  type?: 'direct_add' | 'invitation';
  invitation_id?: string;
}

interface CancelInvitationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface RemoveUserResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, organizationId, role }: InviteUserParams) => {
      const { data, error } = await supabase.rpc('invite_user_to_organization', {
        p_email: email,
        p_organization_id: organizationId,
        p_role: role
      });

      if (error) throw error;
      
      const response = data as InviteUserResponse;
      if (!response.success) throw new Error(response.error);
      
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      queryClient.invalidateQueries({ queryKey: ['organization-invitations'] });
      
      if (data.type === 'direct_add') {
        toast.success('User added to organization successfully!');
      } else {
        toast.success('Invitation sent successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to invite user');
    }
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ invitationId }: CancelInvitationParams) => {
      const { data, error } = await supabase.rpc('cancel_invitation', {
        p_invitation_id: invitationId
      });

      if (error) throw error;
      
      const response = data as CancelInvitationResponse;
      if (!response.success) throw new Error(response.error);
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-invitations'] });
      toast.success('Invitation cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel invitation');
    }
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, organizationId }: RemoveUserParams) => {
      const { data, error } = await supabase.rpc('remove_user_from_organization', {
        p_user_id: userId,
        p_organization_id: organizationId
      });

      if (error) throw error;
      
      const response = data as RemoveUserResponse;
      if (!response.success) throw new Error(response.error);
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      toast.success('User removed from organization successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove user');
    }
  });
};
