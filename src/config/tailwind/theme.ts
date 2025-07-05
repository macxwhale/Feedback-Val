
import { colors } from './colors';
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
    fontFamily: {
      'sans': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      'space': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      'inter': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
    },
    colors,
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    backgroundImage: {
      'gradient-warm': 'linear-gradient(135deg, #FF6B35, #F67280, #FFC93C)',
      'gradient-dark-warm': 'linear-gradient(135deg, #FF6B35, #F67280, #FFC93C)',
      'fluid-1': 'radial-gradient(ellipse at top, #FF6B35, transparent)',
      'fluid-2': 'radial-gradient(ellipse at bottom right, #F67280, transparent)',
      'fluid-3': 'radial-gradient(ellipse at center left, #FFC93C, transparent)',
    },
    keyframes,
    animation
  }
};
