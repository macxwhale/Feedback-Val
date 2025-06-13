
import React from 'react';
import { useDynamicBranding } from '@/hooks/useDynamicBranding';

interface BrandedHeaderProps {
  title: string;
  subtitle: string;
  showSecureIndicator?: boolean;
}

export const BrandedHeader: React.FC<BrandedHeaderProps> = ({
  title,
  subtitle,
  showSecureIndicator = false
}) => {
  const { colors, assets, organizationName } = useDynamicBranding();

  const headerStyle = {
    background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
  };

  return (
    <div className="p-8 text-white text-center" style={headerStyle}>
      {assets.logoUrl && (
        <img 
          src={assets.logoUrl}
          alt={assets.logoAlt}
          className="h-20 mx-auto mb-6 drop-shadow-lg object-contain"
          onError={(e) => {
            // Fallback to default logo if custom logo fails to load
            (e.target as HTMLImageElement).src = '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png';
            (e.target as HTMLImageElement).alt = 'Default Logo';
          }}
        />
      )}
      <h1 className="text-4xl font-bold mb-3">
        {title}
      </h1>
      <p className="text-xl text-blue-100">
        {subtitle}
      </p>
      {showSecureIndicator && (
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center gap-2 text-green-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Secure & Confidential</span>
          </div>
        </div>
      )}
    </div>
  );
};
