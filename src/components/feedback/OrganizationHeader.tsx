
import React from 'react';
import { useDynamicBranding } from '@/hooks/useDynamicBranding';

export const OrganizationHeader: React.FC = () => {
  const { assets, colors, organizationName, isLoading } = useDynamicBranding();

  if (isLoading) {
    return (
      <div className="text-center mb-8 animate-pulse">
        <div className="mx-auto mb-4 h-16 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded mx-auto max-w-xs mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mx-auto max-w-sm"></div>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      {assets.logoUrl && (
        <img 
          src={assets.logoUrl}
          alt={assets.logoAlt}
          className="mx-auto mb-4 h-16 w-auto object-contain"
          onError={(e) => {
            // Fallback to default logo if custom logo fails to load
            (e.target as HTMLImageElement).src = '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png';
            (e.target as HTMLImageElement).alt = 'Default Logo';
          }}
        />
      )}
      <h1 
        className="text-4xl font-bold mb-2"
        style={{ color: colors.primary }}
      >
        {organizationName}
      </h1>
      <p 
        className="text-lg"
        style={{ color: colors.textSecondary }}
      >
        We value your feedback
      </p>
    </div>
  );
};
