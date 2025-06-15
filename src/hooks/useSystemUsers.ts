import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  accepted_at: string | null;
  organization_id: string;
  organizations: {
    name: string;
    slug: string;
  };
}

export interface SystemInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
  organization_id: string;
  organizations: {
    name: string;
    slug: string;
  };
}

interface SystemUserManagementData {
  users: SystemUser[];
  invitations: SystemInvitation[];
}

export const useSystemUserManagementData = () => {
  return useQuery({
    queryKey: ['system-user-management'],
    queryFn: async (): Promise<SystemUserManagementData> => {
      const { data, error } = await supabase.functions.invoke('system-user-management');
      
      if (error) {
        throw new Error(`Failed to fetch system user data: ${error.message}`);
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAssignUserToOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, email, organizationId, role }: { userId: string; email: string; organizationId: string; role: string }) => {
      const { data, error } = await supabase.functions.invoke('assign-user-to-org', {
        body: { user_id: userId, organization_id: organizationId, role, email },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-user-management'] });
    },
  });
};
