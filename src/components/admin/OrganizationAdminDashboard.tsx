
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/context/OrganizationContext';
import { useDashboard } from '@/context/DashboardContext';
import { useRBAC } from '@/hooks/useRBAC';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { DashboardDataProvider } from '@/components/admin/dashboard/DashboardDataProvider';
import { DashboardTabs } from '@/components/admin/dashboard/DashboardTabs';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';

export const OrganizationAdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAdmin, loading } = useAuth();
  const { organization, loading: orgLoading, error: orgError } = useOrganization();
  const { hasPermission, userRole, isLoading: rbacLoading } = useRBAC(organization?.id);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiveActivity, setIsLiveActivity] = useState(false);

  console.log('OrganizationAdminDashboard:', {
    slug,
    organization: organization?.name,
    userRole,
    hasViewAccess: hasPermission('view_analytics'),
    isAdmin,
    loading: { auth: loading, org: orgLoading, rbac: rbacLoading }
  });

  if (loading || orgLoading || rbacLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (orgError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load organization: {orgError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Organization not found or you don't have access to it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if user has at least viewer access to this organization
  if (!isAdmin && !hasPermission('view_analytics')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PermissionGuard 
          permission="view_analytics" 
          organizationId={organization.id}
          showRequiredRole={true}
          fallback={
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access this organization's dashboard.
                Contact your organization administrator for access.
              </AlertDescription>
            </Alert>
          }
        >
          <div></div>
        </PermissionGuard>
      </div>
    );
  }

  const handleQuickActions = {
    onCreateQuestion: () => setActiveTab('questions'),
    onInviteUser: () => setActiveTab('members'),
    onExportData: () => console.log('Export data'),
    onViewSettings: () => setActiveTab('settings')
  };

  return (
    <PermissionGuard 
      permission="view_analytics" 
      organizationId={organization.id}
      showRequiredRole={true}
    >
      <DashboardDataProvider>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader 
            organizationName={organization.name}
            organizationId={organization.id}
            currentPage={activeTab}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              organization={organization}
              isLiveActivity={isLiveActivity}
              setIsLiveActivity={setIsLiveActivity}
              handleQuickActions={handleQuickActions}
            />
          </main>
        </div>
      </DashboardDataProvider>
    </PermissionGuard>
  );
};
