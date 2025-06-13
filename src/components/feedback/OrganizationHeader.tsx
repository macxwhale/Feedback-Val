
import React from 'react';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

export const OrganizationHeader: React.FC = () => {
  const { organization, logoAsset, colors } = useOrganizationConfig();

  if (!organization) return null;

  return (
    <div className="text-center mb-8">
      {logoAsset?.asset_url && (
        <img 
          src={logoAsset.asset_url} 
          alt={logoAsset.asset_name || `${organization.name} Logo`}
          className="mx-auto mb-4 h-16 w-auto"
        />
      )}
      <h1 
        className="text-4xl font-bold mb-2"
        style={{ color: colors.primary }}
      >
        {organization.name}
      </h1>
      <p className="text-lg text-gray-600">
        We value your feedback
      </p>
    </div>
  );
};
