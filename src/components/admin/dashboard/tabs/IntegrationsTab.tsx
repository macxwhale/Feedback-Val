
import React from 'react';
import { ApiManagement } from '@/components/admin/integrations/ApiManagement';
import { SmsIntegrations } from '@/components/admin/integrations/SmsIntegrations';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { useOrganization } from '@/context/OrganizationContext';

export const IntegrationsTab: React.FC = () => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Organization not found</p>
      </div>
    );
  }

  return (
    <PermissionGuard 
      permission="manage_integrations" 
      organizationId={organization.id}
      showRequiredRole={true}
      fallback={
        <div className="text-center p-8">
          <p className="text-gray-500">You need admin-level access or higher to manage integrations.</p>
          <p className="text-sm text-gray-400 mt-2">
            Contact your organization administrator for access.
          </p>
        </div>
      }
    >
      <div className="w-full space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-muted-foreground">
            Connect your organization to other services and automate your workflows.
          </p>
        </div>
        
        {/* SMS Integrations - Full Width */}
        <div className="w-full">
          <SmsIntegrations />
        </div>
        
        {/* API Keys - Full Width at Bottom */}
        <div className="w-full">
          <ApiManagement />
        </div>
      </div>
    </PermissionGuard>
  );
};

export default IntegrationsTab;
