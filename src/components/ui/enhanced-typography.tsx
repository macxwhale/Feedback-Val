
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const DisplayLarge: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'h1' 
}) => (
  <Component className={cn(
    'text-6xl md:text-7xl font-bold tracking-tight leading-none',
    'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent',
    'dark:from-white dark:via-gray-100 dark:to-gray-300',
    className
  )}>
    {children}
  </Component>
);

export const DisplayMedium: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'h1' 
}) => (
  <Component className={cn(
    'text-4xl md:text-5xl font-bold tracking-tight leading-tight',
    'text-gray-900 dark:text-white',
    className
  )}>
    {children}
  </Component>
);

export const HeadingLarge: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'h2' 
}) => (
  <Component className={cn(
    'text-3xl md:text-4xl font-semibold tracking-tight leading-tight',
    'text-gray-900 dark:text-white',
    className
  )}>
    {children}
  </Component>
);

export const HeadingMedium: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'h3' 
}) => (
  <Component className={cn(
    'text-xl md:text-2xl font-semibold tracking-tight leading-snug',
    'text-gray-900 dark:text-white',
    className
  )}>
    {children}
  </Component>
);

export const HeadingSmall: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'h4' 
}) => (
  <Component className={cn(
    'text-lg font-semibold tracking-tight leading-snug',
    'text-gray-800 dark:text-gray-200',
    className
  )}>
    {children}
  </Component>
);

export const BodyLarge: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'p' 
}) => (
  <Component className={cn(
    'text-lg leading-relaxed text-gray-700 dark:text-gray-300',
    className
  )}>
    {children}
  </Component>
);

export const BodyRegular: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'p' 
}) => (
  <Component className={cn(
    'text-base leading-relaxed text-gray-600 dark:text-gray-400',
    className
  )}>
    {children}
  </Component>
);

export const BodySmall: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'p' 
}) => (
  <Component className={cn(
    'text-sm leading-relaxed text-gray-500 dark:text-gray-500',
    className
  )}>
    {children}
  </Component>
);

export const Caption: React.FC<TypographyProps> = ({ 
  children, 
  className, 
  as: Component = 'span' 
}) => (
  <Component className={cn(
    'text-xs font-medium tracking-wide uppercase text-gray-500 dark:text-gray-500',
    className
  )}>
    {children}
  </Component>
);
