
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Typography Components with Google-inspired hierarchy
export const PageTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h1 className={cn(
    'text-2xl font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-tight',
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
    'text-lg font-medium text-gray-900 dark:text-gray-100 mb-1',
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
    'text-sm text-gray-600 dark:text-gray-400 mb-6',
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
    'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1',
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
    'text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-none',
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
    'border-0 shadow-sm bg-white dark:bg-gray-800 rounded-lg',
    hover && 'hover:shadow-md transition-shadow duration-200',
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
    'border-0 shadow-sm bg-white dark:bg-gray-800 rounded-lg',
    className
  )}>
    {(title || subtitle || headerAction) && (
      <CardHeader className="pb-4 px-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            {title && <SectionTitle className="mb-0">{title}</SectionTitle>}
            {subtitle && <SectionSubtitle className="mb-0 mt-1">{subtitle}</SectionSubtitle>}
          </div>
          {headerAction}
        </div>
      </CardHeader>
    )}
    <CardContent className="p-6">
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
  <div className={cn('space-y-6', className)}>
    {children}
  </div>
);

// Status Indicators
export const StatusDot: React.FC<{
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
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
      variant === 'secondary' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      variant === 'ghost' && 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
      className
    )}
  >
    {children}
  </button>
);
