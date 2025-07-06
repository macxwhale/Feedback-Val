
import { designSystemColors, semanticColors } from '../design-system/colors';
import { typography } from '../design-system/typography';
import { spacing } from '../design-system/spacing';
import { shadows } from '../design-system/shadows';
import { borderRadius } from '../design-system/borderRadius';
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
    // Typography - Material Design 3
    fontFamily: {
      sans: ['Google Sans', 'Roboto', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'monospace'],
    },
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,

    // Colors - Material Design 3 System
    colors: {
      // Design System Colors
      ...designSystemColors,
      
      // Semantic mappings
      brand: semanticColors.brand,
      functional: semanticColors.functional,
      ui: semanticColors.ui,
      data: semanticColors.data,

      // Material Design 3 surface system
      'surface': 'hsl(var(--surface))',
      'surface-variant': 'hsl(var(--surface-variant))',
      'surface-container': 'hsl(var(--surface-container))',
      'surface-container-high': 'hsl(var(--surface-container-high))',
      'surface-container-highest': 'hsl(var(--surface-container-highest))',
      'on-surface': 'hsl(var(--on-surface))',
      'on-surface-variant': 'hsl(var(--on-surface-variant))',
      
      // Outline system
      'outline': 'hsl(var(--outline))',
      'outline-variant': 'hsl(var(--outline-variant))',

      // Shadcn UI colors (using Material Design system)
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      sidebar: {
        DEFAULT: 'hsl(var(--sidebar-background))',
        foreground: 'hsl(var(--sidebar-foreground))',
        primary: 'hsl(var(--sidebar-primary))',
        'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        accent: 'hsl(var(--sidebar-accent))',
        'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        border: 'hsl(var(--sidebar-border))',
        ring: 'hsl(var(--sidebar-ring))'
      }
    },

    // Spacing - Material Design grid
    spacing,

    // Shadows - Material Design elevation
    boxShadow: {
      ...shadows,
      // Material Design 3 specific shadows
      'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      'elevation-2': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
      'elevation-3': '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
      'elevation-4': '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
      'elevation-5': '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
    },

    // Border Radius - Material Design
    borderRadius: {
      ...borderRadius,
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },

    // Background Images - Updated for Material Design
    backgroundImage: {
      'gradient-primary': `linear-gradient(135deg, ${designSystemColors.primary[500]}, ${designSystemColors.primary[600]})`,
      'gradient-secondary': `linear-gradient(135deg, ${designSystemColors.secondary[500]}, ${designSystemColors.secondary[600]})`,
      'gradient-surface': `linear-gradient(135deg, hsl(var(--surface)), hsl(var(--surface-variant)))`,
    },

    // Animations - Material Design motion
    keyframes: {
      ...keyframes,
      // Material Design specific animations
      'material-enter': {
        '0%': { opacity: '0', transform: 'scale(0.8)' },
        '100%': { opacity: '1', transform: 'scale(1)' }
      },
      'material-exit': {
        '0%': { opacity: '1', transform: 'scale(1)' },
        '100%': { opacity: '0', transform: 'scale(0.8)' }
      }
    },
    animation: {
      ...animation,
      'material-enter': 'material-enter 0.2s ease-out',
      'material-exit': 'material-exit 0.2s ease-out'
    }
  }
};
