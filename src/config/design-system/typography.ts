
/**
 * Pulsify Design System - Typography Scale
 * Based on Material Design 3 type scale with refined hierarchy
 */

// Font families
export const fontFamilies = {
  sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
};

// Font weights
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Type scale (Material Design 3 inspired)
export const typeScale = {
  // Display styles
  displayLarge: {
    fontSize: '3.5rem', // 56px
    fontWeight: fontWeights.regular,
    lineHeight: '1.1',
    letterSpacing: '-0.025em',
  },
  displayMedium: {
    fontSize: '2.875rem', // 46px
    fontWeight: fontWeights.regular,
    lineHeight: '1.15',
    letterSpacing: '-0.025em',
  },
  displaySmall: {
    fontSize: '2.25rem', // 36px
    fontWeight: fontWeights.regular,
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: '2rem', // 32px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.25',
    letterSpacing: '-0.025em',
  },
  headlineMedium: {
    fontSize: '1.75rem', // 28px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.3',
    letterSpacing: '-0.025em',
  },
  headlineSmall: {
    fontSize: '1.5rem', // 24px
    fontWeight: fontWeights.semibold,
    lineHeight: '1.35',
    letterSpacing: '-0.025em',
  },
  
  // Title styles
  titleLarge: {
    fontSize: '1.375rem', // 22px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '-0.025em',
  },
  titleMedium: {
    fontSize: '1.125rem', // 18px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '-0.025em',
  },
  titleSmall: {
    fontSize: '1rem', // 16px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '-0.025em',
  },
  
  // Body styles
  bodyLarge: {
    fontSize: '1rem', // 16px
    fontWeight: fontWeights.regular,
    lineHeight: '1.5',
    letterSpacing: '0',
  },
  bodyMedium: {
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeights.regular,
    lineHeight: '1.5',
    letterSpacing: '0',
  },
  bodySmall: {
    fontSize: '0.75rem', // 12px
    fontWeight: fontWeights.regular,
    lineHeight: '1.5',
    letterSpacing: '0',
  },
  
  // Label styles
  labelLarge: {
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '0.025em',
  },
  labelMedium: {
    fontSize: '0.75rem', // 12px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '0.025em',
  },
  labelSmall: {
    fontSize: '0.6875rem', // 11px
    fontWeight: fontWeights.medium,
    lineHeight: '1.4',
    letterSpacing: '0.025em',
  },
};

// Utility classes for common text styles
export const textUtilities = {
  // Semantic text styles
  cardTitle: typeScale.titleMedium,
  cardSubtitle: typeScale.bodyMedium,
  sectionHeader: typeScale.headlineSmall,
  pageTitle: typeScale.headlineLarge,
  
  // Interactive text
  buttonText: typeScale.labelLarge,
  linkText: typeScale.bodyMedium,
  
  // Data display
  metricValue: typeScale.headlineMedium,
  metricLabel: typeScale.labelMedium,
  tableHeader: typeScale.labelLarge,
  tableCell: typeScale.bodyMedium,
};
