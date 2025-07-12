
import React from 'react';
import { DashboardUserMenu } from './DashboardUserMenu';
import { useOrganization } from '@/context/OrganizationContext';

interface DashboardHeaderProps {
  organizationName?: string;
  organizationId?: string;
  currentPage?: string;
  onNavigate?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  organizationName,
  organizationId,
  currentPage,
  onNavigate
}) => {
  const { organization } = useOrganization();
  
  // Use props if provided, otherwise fall back to context
  const displayName = organizationName || organization?.name || 'Dashboard';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {displayName}
            </h1>
            {currentPage && (
              <span className="ml-2 text-sm text-gray-500">
                • {currentPage}
              </span>
            )}
          </div>
          <DashboardUserMenu />
        </div>
      </div>
    </header>
  );
};
