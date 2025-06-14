
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

  // Update default logo alt text and site name if fallback is triggered
  return (
    <div className="p-8 text-white text-center" style={headerStyle}>
      {assets.logoUrl && (
        <img 
          src={assets.logoUrl}
          alt={assets.logoAlt && assets.logoAlt !== "Pulselify Logo"
            ? assets.logoAlt.replace(/Pulselify/gi, 'Pulsify')
            : "Pulsify Logo"}
          className="h-20 mx-auto mb-6 drop-shadow-lg object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/lovable-uploads/pulse-favicon-64.png';
            (e.target as HTMLImageElement).alt = 'Pulsify Logo';
          }}
        />
      )}
      <h1 className="text-4xl font-bold mb-3">
        {title === "Pulselify" ? "Pulsify" : title}
      </h1>
      <p className="text-xl text-blue-100">
        {subtitle === "Turn Customer Feedback Into Growth"
          ? "Real Insights. Real Impact."
          : subtitle}
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
