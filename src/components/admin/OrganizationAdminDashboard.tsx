
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/context/OrganizationContext';
import { useDashboard } from '@/context/DashboardContext';
import { useRBAC } from '@/hooks/useRBAC';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const OrganizationAdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAdmin, loading } = useAuth();
  const { organization, loading: orgLoading, error: orgError, fetchOrganization } = useOrganization();
  const { hasPermission, userRole, isLoading: rbacLoading } = useRBAC(organization?.id);

  useEffect(() => {
    if (slug && !orgLoading) {
      fetchOrganization(slug);
    }
  }, [slug, fetchOrganization, orgLoading]);

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
            Failed to load organization: {orgError.message}
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
        />
      </div>
    );
  }

  return (
    <PermissionGuard 
      permission="view_analytics" 
      organizationId={organization.id}
      showRequiredRole={true}
    >
      <AdminLayout />
    </PermissionGuard>
  );
};
