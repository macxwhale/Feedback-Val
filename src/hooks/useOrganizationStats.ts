
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizationStats = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-stats', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_organization_stats', {
        org_id: organizationId
      });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
