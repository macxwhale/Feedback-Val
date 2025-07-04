
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Google Play Console inspired typography
export const PageTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h1 className={cn(
    'text-2xl font-normal text-gray-800 dark:text-gray-100 tracking-normal leading-tight',
    'font-sans mb-6',
    className
  )}>
    {children}
  </h1>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h2 className={cn(
    'text-lg font-medium text-gray-800 dark:text-gray-100 mb-4',
    'font-sans',
    className
  )}>
    {children}
  </h2>
);

export const SectionSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={cn(
    'text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed',
    'font-sans',
    className
  )}>
    {children}
  </p>
);

export const MetricLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={cn(
    'text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide',
    'font-sans',
    className
  )}>
    {children}
  </p>
);

export const MetricValue: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn(
    'text-2xl font-normal text-gray-900 dark:text-gray-100 leading-none',
    'font-sans',
    className
  )}>
    {children}
  </div>
);

// Google-inspired Card Components
export const GoogleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className, hover = false }) => (
  <Card className={cn(
    'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
    'shadow-sm rounded-lg transition-all duration-200',
    hover && 'hover:shadow-md',
    className
  )}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export const GoogleDashboardCard: React.FC<{
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}> = ({ title, subtitle, children, className, headerAction }) => (
  <Card className={cn(
    'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
    'shadow-sm rounded-lg transition-all duration-200',
    className
  )}>
    {(title || subtitle || headerAction) && (
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && <SectionTitle className="mb-1">{title}</SectionTitle>}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction}
        </div>
      </CardHeader>
    )}
    <CardContent className="px-6 pb-6">
      {children}
    </CardContent>
  </Card>
);

// Google-inspired Layout Components
export const GoogleGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 4, className }) => (
  <div className={cn(
    'grid gap-4',
    columns === 2 && 'grid-cols-1 lg:grid-cols-2',
    columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    className
  )}>
    {children}
  </div>
);

export const GoogleSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('space-y-6', className)}>
    {children}
  </div>
);

// Google-inspired Interactive Elements
export const GoogleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, onClick, variant = 'secondary', size = 'md', className }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center justify-center rounded font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'font-sans',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      variant === 'secondary' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm',
      variant === 'ghost' && 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-2.5 text-base',
      className
    )}
  >
    {children}
  </button>
);

// Google-inspired Badge Component
export const GoogleBadge: React.FC<{
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  className?: string;
}> = ({ children, variant, className }) => (
  <span className={cn(
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
    'font-sans',
    variant === 'success' && 'bg-green-100 text-green-800',
    variant === 'warning' && 'bg-yellow-100 text-yellow-800',
    variant === 'error' && 'bg-red-100 text-red-800',
    variant === 'neutral' && 'bg-gray-100 text-gray-800',
    variant === 'info' && 'bg-blue-100 text-blue-800',
    className
  )}>
    {children}
  </span>
);

// Google-inspired Status Indicator
export const GoogleStatusDot: React.FC<{
  variant: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}> = ({ variant, className }) => (
  <span className={cn(
    'inline-block w-2 h-2 rounded-full',
    variant === 'success' && 'bg-green-500',
    variant === 'warning' && 'bg-yellow-500',
    variant === 'error' && 'bg-red-500',
    variant === 'neutral' && 'bg-gray-400',
    className
  )} />
);
