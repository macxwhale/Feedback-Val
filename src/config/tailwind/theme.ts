
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
      'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
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
    boxShadow: {
      'refined': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      'refined-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    keyframes,
    animation
  }
};
