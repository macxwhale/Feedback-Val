
import React from 'react';
import { DashboardUserMenu } from './DashboardUserMenu';
import { useOrganization } from '@/context/OrganizationContext';

export const DashboardHeader: React.FC = () => {
  const { organization } = useOrganization();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {organization?.name || 'Dashboard'}
            </h1>
          </div>
          <DashboardUserMenu />
        </div>
      </div>
    </header>
  );
};
