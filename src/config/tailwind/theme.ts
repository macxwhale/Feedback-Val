
import { colors } from './colors';
import { keyframes, animation } from './animations';
import { designTokens } from '../design-tokens';

export const themeConfig = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px'
    }
  },
  extend: {
    fontFamily: {
      'sans': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      'space': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      'inter': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
    },
    colors,
    
    // Enhanced spacing scale
    spacing: designTokens.spacing,
    
    // Modern border radius
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
      ...designTokens.radius
    },
    
    // Enhanced box shadows (elevations)
    boxShadow: {
      ...designTokens.elevation
    },
    
    // Typography enhancements
    fontSize: designTokens.typography.fontSize,
    fontWeight: designTokens.typography.fontWeight,
    
    backgroundImage: {
      'gradient-warm': 'linear-gradient(135deg, #FF6B35, #F67280, #FFC93C)',
      'gradient-dark-warm': 'linear-gradient(135deg, #FF6B35, #F67280, #FFC93C)',
      'gradient-modern': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'gradient-play': 'linear-gradient(135deg, #4285f4 0%, #34a853 25%, #fbbc05 50%, #ea4335 75%, #4285f4 100%)',
      'fluid-1': 'radial-gradient(ellipse at top, #FF6B35, transparent)',
      'fluid-2': 'radial-gradient(ellipse at bottom right, #F67280, transparent)',
      'fluid-3': 'radial-gradient(ellipse at center left, #FFC93C, transparent)',
    },
    
    keyframes,
    animation,
    
    // Additional modern utilities
    backdropBlur: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    }
  }
};
