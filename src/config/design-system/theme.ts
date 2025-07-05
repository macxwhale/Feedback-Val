
/**
 * Pulsify Design System - Complete Theme Configuration
 * Material Design 3 inspired with warm brand identity
 */

import { designSystemColors } from './colors';
import { typeScale, fontFamilies } from './typography';

// Spacing scale (8px base unit)
export const spacing = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
};

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// Shadow system (Material Design elevation)
export const shadows = {
  none: '0 0 #0000',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Material Design specific elevations
  elevation1: '0 1px 3px rgb(0 0 0 / 0.12), 0 1px 2px rgb(0 0 0 / 0.24)',
  elevation2: '0 3px 6px rgb(0 0 0 / 0.16), 0 3px 6px rgb(0 0 0 / 0.23)',
  elevation3: '0 10px 20px rgb(0 0 0 / 0.19), 0 6px 6px rgb(0 0 0 / 0.23)',
  elevation4: '0 14px 28px rgb(0 0 0 / 0.25), 0 10px 10px rgb(0 0 0 / 0.22)',
};

// Animation configuration
export const animations = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  
  // Easing curves (Material Design)
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  },
};

// Complete theme export for Tailwind
export const materialTheme = {
  // Colors
  colors: {
    // Brand colors
    primary: designSystemColors.primary,
    secondary: designSystemColors.secondary,
    accent: designSystemColors.accent,
    
    // Neutrals
    slate: designSystemColors.slate,
    stone: designSystemColors.stone,
    
    // Semantic
    success: designSystemColors.success,
    warning: designSystemColors.warning,
    error: designSystemColors.error,
    info: designSystemColors.info,
    
    // Surface
    background: designSystemColors.surface.background,
    surface: designSystemColors.surface.surface,
    'surface-variant': designSystemColors.surface.surfaceVariant,
    
    // Text
    'text-primary': designSystemColors.text.primary,
    'text-secondary': designSystemColors.text.secondary,
    'text-tertiary': designSystemColors.text.tertiary,
    
    // Interactive states
    hover: designSystemColors.surface.hover,
    pressed: designSystemColors.surface.pressed,
    focused: designSystemColors.surface.focused,
    
    // Borders
    outline: designSystemColors.surface.outline,
    'outline-variant': designSystemColors.surface.outlineVariant,
    divider: designSystemColors.surface.divider,
  },
  
  // Typography
  fontFamily: {
    sans: fontFamilies.sans,
    mono: fontFamilies.mono,
  },
  
  fontSize: {
    'display-lg': [typeScale.displayLarge.fontSize, { lineHeight: typeScale.displayLarge.lineHeight }],
    'display-md': [typeScale.displayMedium.fontSize, { lineHeight: typeScale.displayMedium.lineHeight }],
    'display-sm': [typeScale.displaySmall.fontSize, { lineHeight: typeScale.displaySmall.lineHeight }],
    'headline-lg': [typeScale.headlineLarge.fontSize, { lineHeight: typeScale.headlineLarge.lineHeight }],
    'headline-md': [typeScale.headlineMedium.fontSize, { lineHeight: typeScale.headlineMedium.lineHeight }],
    'headline-sm': [typeScale.headlineSmall.fontSize, { lineHeight: typeScale.headlineSmall.lineHeight }],
    'title-lg': [typeScale.titleLarge.fontSize, { lineHeight: typeScale.titleLarge.lineHeight }],
    'title-md': [typeScale.titleMedium.fontSize, { lineHeight: typeScale.titleMedium.lineHeight }],
    'title-sm': [typeScale.titleSmall.fontSize, { lineHeight: typeScale.titleSmall.lineHeight }],
    'body-lg': [typeScale.bodyLarge.fontSize, { lineHeight: typeScale.bodyLarge.lineHeight }],
    'body-md': [typeScale.bodyMedium.fontSize, { lineHeight: typeScale.bodyMedium.lineHeight }],
    'body-sm': [typeScale.bodySmall.fontSize, { lineHeight: typeScale.bodySmall.lineHeight }],
    'label-lg': [typeScale.labelLarge.fontSize, { lineHeight: typeScale.labelLarge.lineHeight }],
    'label-md': [typeScale.labelMedium.fontSize, { lineHeight: typeScale.labelMedium.lineHeight }],
    'label-sm': [typeScale.labelSmall.fontSize, { lineHeight: typeScale.labelSmall.lineHeight }],
  },
  
  // Spacing
  spacing,
  
  // Border radius
  borderRadius,
  
  // Shadows
  boxShadow: shadows,
  
  // Animations
  transitionDuration: animations.duration,
  transitionTimingFunction: animations.easing,
};
