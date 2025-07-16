
import React, { createContext, useContext } from 'react';
import { useOrganization } from '@/context/OrganizationContext';
import { useOrganizationStats } from '@/hooks/organization/useOrganizationData';
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
  console.log('DashboardDataProvider rendering');
  
  const { organization, loading: orgLoading } = useOrganization();
  console.log('Organization from context:', { 
    organization: organization?.name || 'No organization', 
    orgLoading,
    hasOrganization: !!organization 
  });

  const { data: stats, isLoading: statsLoading, error } = useOrganizationStats(organization?.id || '');
  console.log('Stats query result:', { 
    hasStats: !!stats, 
    statsLoading, 
    error: error?.message,
    organizationId: organization?.id 
  });

  // Analytics data is optional and shouldn't block the main dashboard
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData(organization?.id || '');
  console.log('Analytics query result:', {
    hasAnalyticsData: !!analyticsData,
    analyticsLoading,
    organizationId: organization?.id
  });

  // Only consider org and stats loading for main loading state
  // Analytics loading shouldn't block the dashboard
  const isLoading = orgLoading || statsLoading;
  const typedStats: OrganizationStats | null = stats ? (stats as unknown as OrganizationStats) : null;

  console.log('DashboardDataProvider state:', {
    organization: organization?.name || 'No organization',
    hasStats: !!typedStats,
    isLoading,
    analyticsLoading,
    error: error?.message,
    finalLoadingState: isLoading
  });

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
