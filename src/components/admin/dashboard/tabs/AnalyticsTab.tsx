
import React from 'react';
import { AnalyticsDashboard } from '../AnalyticsDashboard';
import { useOrganization } from '@/context/OrganizationContext';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

interface AnalyticsTabProps {
  organizationId: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ organizationId }) => {
  const { isCurrentUserOrgAdmin } = useOrganization();
  
  console.log('AnalyticsTab rendering with organizationId:', organizationId, 'isCurrentUserOrgAdmin:', isCurrentUserOrgAdmin);
  
  if (!organizationId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No organization ID provided</p>
      </div>
    );
  }

  return (
    <PermissionGuard 
      permission="view_analytics" 
      organizationId={organizationId}
      showRequiredRole={true}
      fallback={
        <div className="text-center p-8">
          <p className="text-gray-500">You need viewer-level access or higher to view analytics.</p>
          <p className="text-sm text-gray-400 mt-2">
            Contact your organization administrator for access.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <AnalyticsDashboard organizationId={organizationId} />
      </div>
    </PermissionGuard>
  );
};
