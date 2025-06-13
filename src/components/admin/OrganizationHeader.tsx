
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, UserPlus } from 'lucide-react';

interface OrganizationHeaderProps {
  organization: {
    name: string;
    primary_color: string;
    plan_type?: string;
  };
}

export const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({ organization }) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-gray-600">Organization Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" style={{ 
                backgroundColor: organization.primary_color + '20',
                color: organization.primary_color 
              }}>
                {organization.plan_type || 'Free'}
              </Badge>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
