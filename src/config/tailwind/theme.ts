
import { materialTheme } from '../design-system/theme';
import { keyframes, animation } from './animations';

export const themeConfig = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px'
    }
  },
  extend: {
    // Apply our Material Design system
    ...materialTheme,
    
    // Enhanced animations
    keyframes,
    animation,
    
    // Background patterns for depth
    backgroundImage: {
      'gradient-warm': `linear-gradient(135deg, ${materialTheme.colors.primary[500]}, ${materialTheme.colors.accent[400]})`,
      'gradient-subtle': `linear-gradient(135deg, ${materialTheme.colors.surface}, ${materialTheme.colors['surface-variant']})`,
      'surface-pattern': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
    },
    
    // Material Design backdrop filters
    backdropBlur: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
  }
};
