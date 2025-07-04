
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Typography Components with Google-inspired hierarchy
export const PageTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h1 className={cn(
    'text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-tight',
    'font-inter mb-2',
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
    'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3',
    'font-inter',
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
    'text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed',
    'font-inter',
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
    'text-sm font-medium text-gray-600 dark:text-gray-400 mb-2',
    'font-inter',
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
    'text-3xl font-semibold text-gray-900 dark:text-gray-100 leading-none',
    'font-inter',
    className
  )}>
    {children}
  </div>
);

// Refined Card Components
export const MetricCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className, hover = true }) => (
  <Card className={cn(
    'border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 rounded-xl',
    'transition-all duration-200',
    hover && 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
    className
  )}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export const DashboardCard: React.FC<{
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}> = ({ title, subtitle, children, className, headerAction }) => (
  <Card className={cn(
    'border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 rounded-xl',
    'transition-all duration-200',
    className
  )}>
    {(title || subtitle || headerAction) && (
      <CardHeader className="pb-6 px-8 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && <SectionTitle className="mb-1 text-lg">{title}</SectionTitle>}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction}
        </div>
      </CardHeader>
    )}
    <CardContent className="p-8">
      {children}
    </CardContent>
  </Card>
);

// Layout Components
export const DashboardGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 4, className }) => (
  <div className={cn(
    'grid gap-6',
    columns === 2 && 'grid-cols-1 lg:grid-cols-2',
    columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    className
  )}>
    {children}
  </div>
);

export const DashboardSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('space-y-8', className)}>
    {children}
  </div>
);

// Status Indicators
export const StatusDot: React.FC<{
  variant: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}> = ({ variant, className }) => (
  <span className={cn(
    'inline-block w-2.5 h-2.5 rounded-full',
    variant === 'success' && 'bg-green-500',
    variant === 'warning' && 'bg-yellow-500',
    variant === 'error' && 'bg-red-500',
    variant === 'neutral' && 'bg-gray-400',
    className
  )} />
);

// Interactive Elements
export const ActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, onClick, variant = 'secondary', size = 'md', className }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'font-inter',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
      variant === 'secondary' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md',
      variant === 'ghost' && 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800',
      size === 'sm' && 'px-3 py-2 text-sm',
      size === 'md' && 'px-4 py-2.5 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
      className
    )}
  >
    {children}
  </button>
);

// Enhanced Badge Component
export const StatusBadge: React.FC<{
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  className?: string;
}> = ({ children, variant, className }) => (
  <span className={cn(
    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
    'font-inter',
    variant === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    variant === 'warning' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    variant === 'error' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    variant === 'neutral' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    variant === 'info' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    className
  )}>
    {children}
  </span>
);
