
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  const containerClasses = cn(
    'flex items-center justify-center',
    {
      'min-h-screen': fullScreen,
      'p-4': !fullScreen,
      'space-x-2': text
    },
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && (
        <span className="text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};
