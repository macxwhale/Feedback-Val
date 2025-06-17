
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemUser {
  user_id: string;
  email: string;
  organization_user_id?: string;
  organization_id?: string;
  role?: string;
  status?: string;
  organization_user_created_at?: string;
  accepted_at?: string;
  invited_by_user_id?: string;
}

export interface SystemInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  organization_id: string;
  organization_name: string;
  created_at: string;
  expires_at: string;
  invited_by_user_id: string;
}

interface SystemUserManagementData {
  users: SystemUser[];
  invitations: SystemInvitation[];
}

export const useSystemUserManagementData = () => {
  return useQuery({
    queryKey: ['system-user-management'],
    queryFn: async (): Promise<SystemUserManagementData> => {
      // Get all users with their organization assignments
      const { data: usersData, error: usersError } = await supabase
        .from('all_users_with_org')
        .select('*')
        .order('email');

      if (usersError) throw usersError;

      // Get all pending invitations with organization names
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('user_invitations')
        .select(`
          *,
          organizations!inner(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitationsError) throw invitationsError;

      const invitations = invitationsData?.map(inv => ({
        ...inv,
        organization_name: inv.organizations?.name || 'Unknown Organization'
      })) || [];

      return {
        users: usersData || [],
        invitations: invitations as SystemInvitation[]
      };
    },
    staleTime: 30000,
  });
};

export const useAssignUserToOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      email,
      organizationId,
      role
    }: {
      userId: string;
      email: string;
      organizationId: string;
      role: string;
    }) => {
      const { data, error } = await supabase
        .from('organization_users')
        .insert({
          user_id: userId,
          email: email,
          organization_id: organizationId,
          role: role,
          status: 'active',
          accepted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-user-management'] });
    },
  });
};

export const useApproveAllInvitations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('approve_all_pending_invitations');
      if (error) throw error;
      return data || { approvedCount: 0, failedCount: 0 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-user-management'] });
    },
  });
};
