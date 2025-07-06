
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centerContent?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
  centerContent = true
}) => {
  const { isMobile, isTablet } = useResponsiveDesign();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6'
  };

  // Adjust padding for mobile
  const mobilePadding = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-3 py-3',
    lg: 'px-4 py-4'
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        isMobile ? mobilePadding[padding] : paddingClasses[padding],
        centerContent && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};
