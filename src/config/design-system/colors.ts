
// Material Design 3 Color System - Google Play Console Inspired
// Based on Material You color tokens and semantic color usage

export const designSystemColors = {
  // Primary Brand Colors (Material Blue)
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Main primary - Material Blue
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
    950: '#0a3d91',
  },

  // Secondary Colors (Teal/Green - Play Console style)
  secondary: {
    50: '#e0f2f1',
    100: '#b2dfdb',
    200: '#80cbc4',
    300: '#4db6ac',
    400: '#26a69a',
    500: '#009688', // Main secondary - Material Teal
    600: '#00897b',
    700: '#00796b',
    800: '#00695c',
    900: '#004d40',
    950: '#003d32',
  },

  // Success Colors (Material Green)
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Main success
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
    950: '#0d4f14',
  },

  // Error Colors (Material Red)
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336', // Main error
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
    950: '#a71a1a',
  },

  // Warning Colors (Material Amber)
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107', // Main warning
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
    950: '#e65100',
  },

  // Neutral Colors (Material Design surface system)
  neutral: {
    0: '#ffffff',
    10: '#fafafa',
    50: '#f5f5f5',
    100: '#f0f0f0',
    200: '#e0e0e0',
    300: '#c2c2c2',
    400: '#a6a6a6',
    500: '#8a8a8a',
    600: '#6c6c6c',
    700: '#525252',
    800: '#3d3d3d',
    900: '#262626',
    950: '#0a0a0a',
  },

  // Surface system for Material Design 3
  surface: {
    background: '#ffffff',
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'surface-container-lowest': '#ffffff',
    'surface-container-low': '#fcfcfc',
    'surface-container': '#f6f6f6',
    'surface-container-high': '#f0f0f0',
    'surface-container-highest': '#e6e6e6',
    'surface-dim': '#d3d3d3',
    'surface-bright': '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },

  // Text system for proper contrast
  text: {
    primary: '#1a1a1a',
    secondary: '#5f6368',
    tertiary: '#80868b',
    disabled: '#c0c0c0',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-surface': '#1a1a1a',
    'on-surface-variant': '#44474e',
  },

  // Outline system
  outline: {
    outline: '#79747e',
    'outline-variant': '#cac4cf',
  },

  // Interactive states
  states: {
    hover: {
      primary: '#1e88e5',
      secondary: '#00897b',
      surface: '#f5f5f5',
    },
    pressed: {
      primary: '#1565c0',
      secondary: '#00796b',
      surface: '#e0e0e0',
    },
    focus: {
      ring: '#2196f3',
      offset: '#ffffff',
    },
    disabled: {
      background: '#f5f5f5',
      text: '#c0c0c0',
      border: '#e0e0e0',
    },
  },
};

// Semantic Color Mappings for Google Play Console style
export const semanticColors = {
  // Brand Identity
  brand: {
    primary: designSystemColors.primary[500],
    secondary: designSystemColors.secondary[500],
    accent: designSystemColors.primary[600],
  },

  // Functional Colors
  functional: {
    success: designSystemColors.success[500],
    error: designSystemColors.error[500],
    warning: designSystemColors.warning[500],
    info: designSystemColors.primary[500],
  },

  // UI Elements
  ui: {
    background: designSystemColors.surface.background,
    surface: designSystemColors.surface.surface,
    'surface-variant': designSystemColors.surface['surface-variant'],
    border: designSystemColors.outline.outline,
    divider: designSystemColors.outline['outline-variant'],
  },

  // Data Visualization (for analytics and charts)
  data: {
    primary: designSystemColors.primary[500],
    secondary: designSystemColors.secondary[500],
    tertiary: designSystemColors.success[500],
    quaternary: designSystemColors.warning[500],
    positive: designSystemColors.success[600],
    negative: designSystemColors.error[500],
    neutral: designSystemColors.neutral[500],
  },
};

// Export utility functions for color manipulation
export const colorUtils = {
  // Get color with opacity
  withOpacity: (color: string, opacity: number) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },

  // Get hover state color
  getHoverState: (colorKey: keyof typeof designSystemColors.states.hover) => {
    return designSystemColors.states.hover[colorKey];
  },

  // Get pressed state color
  getPressedState: (colorKey: keyof typeof designSystemColors.states.pressed) => {
    return designSystemColors.states.pressed[colorKey];
  },
};
