
import { useState, useEffect } from 'react';

interface UseResponsiveDesignReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  isTouchDevice: boolean;
  hasHover: boolean;
}

export const useResponsiveDesign = (): UseResponsiveDesignReturn => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Set initial value
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Detect touch device
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  );

  // Detect hover capability (typically desktop with mouse)
  const hasHover = typeof window !== 'undefined' && 
    window.matchMedia('(hover: hover)').matches;

  const getBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    breakpoint: getBreakpoint(),
    isTouchDevice,
    hasHover
  };
};
