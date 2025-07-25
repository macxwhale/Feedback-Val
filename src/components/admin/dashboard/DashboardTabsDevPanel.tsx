
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardModuleKey } from './DashboardTabs';

interface DashboardTabsDevPanelProps {
  module: DashboardModuleKey;
  organization?: any;
}

export const DashboardTabsDevPanel: React.FC<DashboardTabsDevPanelProps> = ({ 
  module,
  organization 
}) => {
  const getModuleContent = () => {
    switch (module) {
      case 'overview':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization Overview</h3>
            {organization && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Organization Name</p>
                  <p className="font-medium">{organization.name}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Plan Type</p>
                  <p className="font-medium">{organization.plan_type}</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'users':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Management</h3>
            <p className="text-muted-foreground">Manage organization users and permissions</p>
          </div>
        );
      case 'questions':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Management</h3>
            <p className="text-muted-foreground">Create and manage feedback questions</p>
          </div>
        );
      case 'responses':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Response Management</h3>
            <p className="text-muted-foreground">View and analyze feedback responses</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-muted-foreground">View detailed analytics and insights</p>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Integrations</h3>
            <p className="text-muted-foreground">Manage third-party integrations</p>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing</h3>
            <p className="text-muted-foreground">Manage subscription and billing</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <p className="text-muted-foreground">Configure organization settings</p>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Development Panel</h3>
            <p className="text-muted-foreground">Module: {module}</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{module} Module</CardTitle>
      </CardHeader>
      <CardContent>
        {getModuleContent()}
      </CardContent>
    </Card>
  );
};
