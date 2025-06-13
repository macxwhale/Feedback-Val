
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
import { useOrganizationStats } from '@/hooks/useOrganizationStats';

export const OrganizationAdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiveActivity, setIsLiveActivity] = useState(true);

  // Fetch organization data
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  // Fetch organization stats for sidebar
  const { data: stats } = useOrganizationStats(organization?.id || '');

  // Navigation handlers
  const { handleNavigate, getTabLabel, handleQuickActions } = useDashboardNavigation({
    setActiveTab
  });

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h2>
          <p className="text-gray-600">The organization you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <DashboardSidebar
            organizationName={organization.name}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={stats}
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
  );
};
