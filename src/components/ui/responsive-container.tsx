
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { responsiveSpacing } from '@/config/design-system/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'auto';
  centerContent?: boolean;
  touchOptimized?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'full',
  padding = 'auto',
  centerContent = true,
  touchOptimized = false
}) => {
  const { 
    currentBreakpoint, 
    shouldUseCompactLayout, 
    shouldUseTouch,
    getResponsiveValue,
    prefersReducedMotion
  } = useResponsiveDesign();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  // Get responsive padding based on current breakpoint
  const containerPadding = React.useMemo(() => {
    if (padding === 'none') return '0';
    
    if (padding === 'auto') {
      return getResponsiveValue(responsiveSpacing.container);
    }
    
    // Manual padding values optimized for dashboard content
    const paddingValues = {
      sm: { xs: '1rem', sm: '1rem', md: '1.25rem', lg: '1.5rem', xl: '1.75rem' },
      md: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '2rem', xl: '2.25rem' },
      lg: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' }
    };
    
    return getResponsiveValue(paddingValues[padding]);
  }, [padding, getResponsiveValue]);

  // Touch optimization
  const effectiveTouchOptimized = touchOptimized || shouldUseTouch;

  return (
    <div
      className={cn(
        'w-full transition-all',
        !prefersReducedMotion && 'duration-300 ease-out',
        maxWidthClasses[maxWidth],
        centerContent && maxWidth !== 'full' && 'mx-auto',
        
        // Touch optimizations
        effectiveTouchOptimized && [
          'touch-pan-y touch-pan-x',
          shouldUseCompactLayout && 'space-y-4',
        ],
        
        // Improved spacing for dashboard content
        !shouldUseCompactLayout && 'space-y-6',
        
        // Ensure content fits properly
        'min-h-0 overflow-hidden',
        
        className
      )}
      style={{
        padding: containerPadding
      }}
    >
      {children}
    </div>
  );
};
