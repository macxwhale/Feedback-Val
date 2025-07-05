
/**
 * Pulsify Design System - Color Palette
 * Inspired by Material Design 3 with warm brand identity
 */

// Core Brand Colors (Your warm identity)
export const brandColors = {
  // Primary - Warm Orange (Your signature)
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#FF6B35', // Main brand color
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  
  // Secondary - Warm Coral
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#F67280', // Your warm coral
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724',
  },
  
  // Accent - Golden Yellow
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#FFC93C', // Your golden yellow
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
};

// Professional Neutrals (Material Design inspired)
export const neutralColors = {
  // Cool grays for professional feel
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Warm grays for brand consistency
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
};

// Semantic Colors (Material Design approach)
export const semanticColors = {
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main info
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Surface Colors (Google Play Console inspired)
export const surfaceColors = {
  // Primary surfaces
  background: '#fafafa', // Warm off-white
  surface: '#ffffff',
  surfaceVariant: '#f8f9fa',
  
  // Interactive surfaces
  hover: 'rgba(255, 107, 53, 0.04)', // Primary with low opacity
  pressed: 'rgba(255, 107, 53, 0.08)',
  focused: 'rgba(255, 107, 53, 0.12)',
  
  // Border colors
  outline: '#e2e8f0',
  outlineVariant: '#f1f5f9',
  divider: '#f1f5f9',
};

// Text Colors (Material Design approach)
export const textColors = {
  primary: '#1e293b', // High emphasis
  secondary: '#475569', // Medium emphasis
  tertiary: '#64748b', // Low emphasis
  disabled: '#94a3b8',
  
  // On colored backgrounds
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onSuccess: '#ffffff',
  onWarning: '#ffffff',
  onError: '#ffffff',
  onInfo: '#ffffff',
};

// Complete color system export
export const designSystemColors = {
  ...brandColors,
  ...neutralColors,
  ...semanticColors,
  surface: surfaceColors,
  text: textColors,
};
