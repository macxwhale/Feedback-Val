
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OrganizationSettingsProps {
  organizationId: string;
}

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ organizationId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Manage your organization's configuration and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">General Settings</h3>
              <p className="text-sm text-gray-600">Configure basic organization settings</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Branding</h3>
              <p className="text-sm text-gray-600">Customize your organization's appearance</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Integrations</h3>
              <p className="text-sm text-gray-600">Manage third-party integrations</p>
            </div>
            <p className="text-xs text-gray-400 mt-4">Organization ID: {organizationId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
