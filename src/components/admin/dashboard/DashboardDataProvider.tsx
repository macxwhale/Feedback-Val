
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/context/OrganizationContext';
import { getOrganizationStatsEnhanced } from '@/services/organizationQueries';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { OrganizationStats } from '@/types/organizationStats';

interface DashboardContextValue {
  organization: any;
  stats: OrganizationStats | null;
  analyticsData: any;
  isLoading: boolean;
  error: Error | null;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const useDashboardData = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardDataProvider');
  }
  return context;
};

interface DashboardDataProviderProps {
  children: React.ReactNode;
}

export const DashboardDataProvider: React.FC<DashboardDataProviderProps> = ({ children }) => {
  const { organization, loading: orgLoading } = useOrganization();

  const { data: stats, isLoading: statsLoading, error } = useQuery({
    queryKey: ['organization-stats', organization?.id],
    queryFn: () => getOrganizationStatsEnhanced(organization!.id),
    enabled: !!organization?.id,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData(organization?.id || '');

  const isLoading = orgLoading || statsLoading || analyticsLoading;
  const typedStats: OrganizationStats | null = stats ? (stats as unknown as OrganizationStats) : null;

  const value: DashboardContextValue = {
    organization,
    stats: typedStats,
    analyticsData,
    isLoading,
    error,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
