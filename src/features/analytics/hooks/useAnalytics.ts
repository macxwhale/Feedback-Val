
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';

export const useAnalytics = (organizationId: string) => {
  const analyticsQuery = useQuery({
    queryKey: ['analytics', organizationId],
    queryFn: () => AnalyticsService.getOrganizationAnalytics(organizationId),
    enabled: !!organizationId,
  });

  return {
    data: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    error: analyticsQuery.error,
  };
};
