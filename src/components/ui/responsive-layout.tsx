import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { 
  responsiveSpacing, 
  layoutDensity, 
  touchTargets,
  type LayoutDensity,
  type TouchTarget 
} from '@/config/design-system/responsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  
  // Layout density options
  density?: LayoutDensity | 'auto';
  
  // Container behavior
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  padding?: 'none' | 'auto';
  centerContent?: boolean;
  
  // Touch optimization
  touchOptimized?: boolean;
  
  // Accessibility
  skipLink?: string;
  ariaLabel?: string;
  role?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  density = 'auto',
  maxWidth = 'full',
  padding = 'auto',
  centerContent = true,
  touchOptimized = false,
  skipLink,
  ariaLabel,
  role = 'main'
}) => {
  const {
    currentBreakpoint,
    shouldUseCompactLayout,
    shouldUseTouch,
    getResponsiveValue,
    prefersReducedMotion
  } = useResponsiveDesign();

  // Determine layout density
  const effectiveDensity = React.useMemo(() => {
    if (density !== 'auto') return density;
    
    if (shouldUseCompactLayout) return 'compact';
    if (currentBreakpoint === 'xl') return 'spacious';
    return 'comfortable';
  }, [density, shouldUseCompactLayout, currentBreakpoint]);

  // Get responsive padding
  const containerPadding = React.useMemo(() => {
    if (padding === 'none') return '';
    
    return getResponsiveValue(responsiveSpacing.container);
  }, [padding, getResponsiveValue]);

  // Get max width classes
  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  // Touch target styles
  const touchStyles = shouldUseTouch || touchOptimized ? {
    minHeight: touchTargets.comfortable.height,
    minWidth: touchTargets.comfortable.width,
  } : {};

  return (
    <div
      className={cn(
        'w-full transition-all',
        !prefersReducedMotion && 'duration-300 ease-out',
        
        // Max width
        maxWidthClasses[maxWidth],
        
        // Centering
        centerContent && maxWidth !== 'full' && 'mx-auto',
        
        // Density-based spacing
        effectiveDensity === 'compact' && 'space-y-3',
        effectiveDensity === 'comfortable' && 'space-y-4',
        effectiveDensity === 'spacious' && 'space-y-6',
        
        className
      )}
      style={{
        padding: containerPadding,
        ...touchStyles,
      }}
      role={role}
      aria-label={ariaLabel}
    >
      {/* Skip link for accessibility */}
      {skipLink && (
        <a
          href={skipLink}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>
      )}
      
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  
  // Grid configuration
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  
  // Gap configuration
  gap?: 'sm' | 'md' | 'lg' | 'auto';
  
  // Alignment
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 'auto',
  alignItems = 'stretch',
  justifyContent = 'start'
}) => {
  const { 
    currentBreakpoint, 
    getResponsiveValue,
    shouldUseCompactLayout,
    prefersReducedMotion 
  } = useResponsiveDesign();

  // Get current column count
  const currentColumns = getResponsiveValue(columns);
  
  // Get responsive gap
  const gridGap = React.useMemo(() => {
    if (gap !== 'auto') return gap;
    return shouldUseCompactLayout ? 'sm' : 'md';
  }, [gap, shouldUseCompactLayout]);

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4', 
    lg: 'gap-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div
      className={cn(
        'grid transition-all',
        !prefersReducedMotion && 'duration-300 ease-out',
        gapClasses[gridGap],
        alignClasses[alignItems],
        justifyClasses[justifyContent],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${currentColumns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  
  // Stack direction
  direction?: 'vertical' | 'horizontal' | 'auto';
  
  // Spacing
  spacing?: 'sm' | 'md' | 'lg' | 'auto';
  
  // Alignment
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  // Responsive behavior
  stackAt?: 'xs' | 'sm' | 'md' | 'lg' | 'never';
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className,
  direction = 'auto',
  spacing = 'auto',
  align = 'stretch',
  justify = 'start',
  stackAt = 'sm'
}) => {
  const { 
    currentBreakpoint, 
    shouldUseCompactLayout,
    isBreakpointDown,
    prefersReducedMotion 
  } = useResponsiveDesign();

  // Determine if should stack
  const shouldStack = React.useMemo(() => {
    if (direction === 'vertical') return true;
    if (direction === 'horizontal') return false;
    if (stackAt === 'never') return false;
    
    return isBreakpointDown(stackAt);
  }, [direction, stackAt, isBreakpointDown]);

  // Get spacing value
  const stackSpacing = React.useMemo(() => {
    if (spacing !== 'auto') return spacing;
    return shouldUseCompactLayout ? 'sm' : 'md';
  }, [spacing, shouldUseCompactLayout]);

  const spacingClasses = {
    sm: shouldStack ? 'space-y-2' : 'space-x-2',
    md: shouldStack ? 'space-y-4' : 'space-x-4',
    lg: shouldStack ? 'space-y-6' : 'space-x-6',
  };

  const alignClasses = {
    start: shouldStack ? 'items-start' : 'items-start',
    center: shouldStack ? 'items-center' : 'items-center', 
    end: shouldStack ? 'items-end' : 'items-end',
    stretch: shouldStack ? 'items-stretch' : 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div
      className={cn(
        'flex transition-all',
        !prefersReducedMotion && 'duration-300 ease-out',
        shouldStack ? 'flex-col' : 'flex-row',
        spacingClasses[stackSpacing],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
};