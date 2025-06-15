
import React from 'react';
import { Building } from 'lucide-react';

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
        <div className="py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-sunset-100 p-2 sm:p-3 rounded-lg">
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-sunset-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-sm sm:text-base text-gray-600">Organization Dashboard</p>
              </div>
            </div>
            {/* "Invite Member" button removed */}
          </div>
        </div>
      </div>
    </div>
  );
};
