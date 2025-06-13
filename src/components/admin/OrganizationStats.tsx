
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Organization } from '@/services/organizationService';

interface OrganizationStatsProps {
  organizations: Organization[];
}

export const OrganizationStats: React.FC<OrganizationStatsProps> = ({ organizations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{organizations?.length || 0}</div>
          <p className="text-sm text-gray-600">Total Organizations</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {organizations?.filter(org => org.is_active).length || 0}
          </div>
          <p className="text-sm text-gray-600">Active</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {organizations?.filter(org => org.plan_type === 'pro').length || 0}
          </div>
          <p className="text-sm text-gray-600">Pro Plans</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {organizations?.filter(org => org.plan_type === 'enterprise').length || 0}
          </div>
          <p className="text-sm text-gray-600">Enterprise</p>
        </CardContent>
      </Card>
    </div>
  );
};
