
import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive = false
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800',
    elevated: 'bg-white dark:bg-gray-900 shadow-lg shadow-gray-100/50 dark:shadow-black/20 border border-gray-50 dark:border-gray-800',
    bordered: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const interactiveClasses = interactive 
    ? 'hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      interactiveClasses,
      className
    )}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumCardHeader: React.FC<CardHeaderProps> = ({
  children,
  className
}) => (
  <div className={cn('space-y-2 mb-6', className)}>
    {children}
  </div>
);

export const PremiumCardContent: React.FC<CardHeaderProps> = ({
  children,
  className
}) => (
  <div className={cn('space-y-4', className)}>
    {children}
  </div>
);

export const PremiumCardFooter: React.FC<CardHeaderProps> = ({
  children,
  className
}) => (
  <div className={cn('flex items-center justify-between pt-6 mt-6 border-t border-gray-100 dark:border-gray-800', className)}>
    {children}
  </div>
);
