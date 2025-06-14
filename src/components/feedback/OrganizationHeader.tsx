
import React from 'react';
import { useDynamicBranding } from '@/hooks/useDynamicBranding';

export const OrganizationHeader: React.FC = () => {
  const { assets, organizationName } = useDynamicBranding();

  return (
    <div className="flex items-center gap-3 py-4">
      <img 
        src={assets.logoUrl || "/placeholder.svg"} 
        alt={assets.logoAlt} 
        className="h-10 object-contain"
      />
      <span className="font-semibold text-lg text-gray-800">{organizationName}</span>
    </div>
  );
};
