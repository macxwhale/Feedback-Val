
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  as?: 'label' | 'span' | 'div';
}

export const H1: React.FC<TypographyProps> = ({ children, className, as: Component = 'h1' }) => (
  <Component className={cn(
    'scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl',
    'leading-tight text-gray-900 dark:text-gray-100',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);

export const H2: React.FC<TypographyProps> = ({ children, className, as: Component = 'h2' }) => (
  <Component className={cn(
    'scroll-m-20 text-2xl font-semibold tracking-tight',
    'text-gray-900 dark:text-gray-100',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);

export const H3: React.FC<TypographyProps> = ({ children, className, as: Component = 'h3' }) => (
  <Component className={cn(
    'scroll-m-20 text-xl font-semibold tracking-tight',
    'text-gray-900 dark:text-gray-100',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);

export const H4: React.FC<TypographyProps> = ({ children, className, as: Component = 'h4' }) => (
  <Component className={cn(
    'scroll-m-20 text-lg font-medium tracking-tight',
    'text-gray-800 dark:text-gray-200',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);

export const Body: React.FC<TypographyProps> = ({ children, className, as: Component = 'p' }) => (
  <Component className={cn(
    'text-base leading-relaxed text-gray-700 dark:text-gray-300',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);

export const BodySmall: React.FC<TypographyProps> = ({ children, className, as: Component = 'p' }) => (
  <Component className={cn(
    'text-sm leading-relaxed text-gray-600 dark:text-gray-400',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);

export const Caption: React.FC<TypographyProps> = ({ children, className, as: Component = 'span' }) => (
  <Component className={cn(
    'text-xs text-gray-500 dark:text-gray-400 font-medium',
    'font-inter tracking-wide',
    className
  )}>
    {children}
  </Component>
);

export const Label: React.FC<LabelProps> = ({ children, className, as: Component = 'label' }) => (
  <Component className={cn(
    'text-sm font-medium text-gray-700 dark:text-gray-300',
    'font-inter',
    className
  )}>
    {children}
  </Component>
);
