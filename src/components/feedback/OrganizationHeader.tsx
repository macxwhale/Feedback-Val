
import React from 'react';
import { useOrganizationContext } from '@/context/OrganizationContext';

export const OrganizationHeader: React.FC = () => {
  const { organization } = useOrganizationContext();

  if (!organization) return null;

  return (
    <div className="text-center mb-8">
      {organization.logo_url && (
        <img 
          src={organization.logo_url} 
          alt={`${organization.name} Logo`}
          className="mx-auto mb-4 h-16 w-auto"
        />
      )}
      <h1 
        className="text-4xl font-bold mb-2"
        style={{ color: organization.primary_color }}
      >
        {organization.name}
      </h1>
      <p className="text-lg text-gray-600">
        We value your feedback
      </p>
    </div>
  );
};
