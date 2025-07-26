
import { useQuery } from '@tanstack/react-query';
import { getOrganizationBySlug, getOrganizationStatsEnhanced } from '@/services/organization';

export const useOrganizationBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['organization', slug],
    queryFn: () => getOrganizationBySlug(slug),
    enabled: !!slug,
  });
};

export const useOrganizationStats = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-stats', organizationId],
    queryFn: () => getOrganizationStatsEnhanced(organizationId),
    enabled: !!organizationId,
  });
};
