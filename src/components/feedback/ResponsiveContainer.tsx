
import React from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = ''
}) => {
  const { isMobile, isTablet } = useMobileDetection();

  const containerClasses = `
    ${isMobile ? 'px-4 py-2' : isTablet ? 'px-6 py-4' : 'px-8 py-6'}
    ${isMobile ? 'max-w-full' : isTablet ? 'max-w-3xl' : 'max-w-4xl'}
    mx-auto
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};
