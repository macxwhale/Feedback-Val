
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrganizationSettingsTabProps {
  organization: {
    name: string;
    slug: string;
    primary_color: string;
    secondary_color: string;
  };
}

export const OrganizationSettingsTab: React.FC<OrganizationSettingsTabProps> = ({ organization }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={organization.name}
              className="w-full p-2 border rounded-md"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Slug
            </label>
            <input
              type="text"
              value={organization.slug}
              className="w-full p-2 border rounded-md bg-gray-50"
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: organization.primary_color }}
                />
                <span className="text-sm text-gray-600">{organization.primary_color}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: organization.secondary_color }}
                />
                <span className="text-sm text-gray-600">{organization.secondary_color}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
