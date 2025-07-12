
import React from 'react';
import { useParams } from 'react-router-dom';
import { OrganizationAdminDashboard } from '@/components/admin/OrganizationAdminDashboard';

const OrganizationAdmin: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Organization Not Found</h2>
          <p className="text-gray-600">Invalid organization slug.</p>
        </div>
      </div>
    );
  }

  return <OrganizationAdminDashboard />;
};

export { OrganizationAdmin };
