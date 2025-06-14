import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { OrganizationHeader } from './OrganizationHeader';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { DashboardErrorBoundary } from './dashboard/DashboardErrorBoundary';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardTabs } from './dashboard/DashboardTabs';
import { useDashboardNavigation } from './dashboard/DashboardNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useEnhancedOrganizationStats } from '@/hooks/useEnhancedOrganizationStats';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { EnhancedLoadingSpinner } from './dashboard/EnhancedLoadingSpinner';
import { DashboardProvider } from '@/context/DashboardContext';
import { DashboardFilters } from './dashboard/DashboardFilters';

export const OrganizationAdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiveActivity, setIsLiveActivity] = useState(true);

  // Fetch organization data
  const { data: organization, isLoading: orgLoading, error: orgError } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      console.log('Fetching organization by slug:', slug);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching organization:', error);
        throw error;
      }
      console.log('Organization fetched successfully:', data);
      return data;
    },
    enabled: !!slug,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch enhanced organization stats
  const { data: stats, isLoading: statsLoading } = useEnhancedOrganizationStats(organization?.id || '');

  // Set up real-time updates
  useRealtimeUpdates(organization?.id || '');

  // Navigation handlers
  const { handleNavigate, getTabLabel, handleQuickActions } = useDashboardNavigation({
    setActiveTab
  });

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedLoadingSpinner size="lg" text="Loading organization dashboard..." />
      </div>
    );
  }

  if (orgError || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {orgError ? 'Error Loading Organization' : 'Organization Not Found'}
          </h2>
          <p className="text-gray-600">
            {orgError 
              ? 'There was an error loading the organization. Please try again.'
              : "The organization you're looking for doesn't exist."
            }
          </p>
          {orgError && (
            <p className="text-sm text-red-600 mt-2">
              Error: {orgError.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardErrorBoundary>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50">
            <DashboardSidebar
              organizationName={organization.name}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              stats={stats}
              isLoading={statsLoading}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
              <OrganizationHeader organization={organization} />

              <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <DashboardHeader
                    organizationName={organization.name}
                    organizationId={organization.id}
                    currentPage={getTabLabel(activeTab)}
                    onNavigate={handleNavigate}
                  />

                  <DashboardFilters organizationId={organization.id} />

                  <DashboardTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    organization={organization}
                    stats={stats}
                    isLiveActivity={isLiveActivity}
                    setIsLiveActivity={setIsLiveActivity}
                    handleQuickActions={handleQuickActions}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </DashboardErrorBoundary>
    </DashboardProvider>
  );
};
