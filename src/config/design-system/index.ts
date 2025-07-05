
// Design System Entry Point
export { designSystemColors, semanticColors, colorUtils } from './colors';
export { typography } from './typography';
export { spacing, componentSpacing } from './spacing';
export { shadows } from './shadows';
export { borderRadius } from './borderRadius';

// Combined theme object for easy consumption
export const designSystem = {
  colors: designSystemColors,
  semantic: semanticColors,
  typography,
  spacing,
  shadows,
  borderRadius,
} as const;

// Type definitions for TypeScript
export type DesignSystemColors = typeof designSystemColors;
export type SemanticColors = typeof semanticColors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Shadows = typeof shadows;
export type BorderRadius = typeof borderRadius;
