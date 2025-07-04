
import React from 'react';
import { cn } from '@/lib/utils';

// Typography System - Inspired by Stripe's clear hierarchy
export const DesignText = {
  // Display text for hero sections
  Display: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn(
      "text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight",
      className
    )} {...props}>
      {children}
    </h1>
  ),

  // Primary headings
  Heading1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn(
      "text-3xl font-semibold text-gray-900 dark:text-white tracking-tight leading-tight",
      className
    )} {...props}>
      {children}
    </h1>
  ),

  // Section headings
  Heading2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn(
      "text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight",
      className
    )} {...props}>
      {children}
    </h2>
  ),

  // Subsection headings
  Heading3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn(
      "text-lg font-medium text-gray-800 dark:text-gray-100",
      className
    )} {...props}>
      {children}
    </h3>
  ),

  // Body text
  Body: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn(
      "text-base text-gray-600 dark:text-gray-300 leading-relaxed",
      className
    )} {...props}>
      {children}
    </p>
  ),

  // Smaller body text
  BodySmall: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn(
      "text-sm text-gray-600 dark:text-gray-300 leading-relaxed",
      className
    )} {...props}>
      {children}
    </p>
  ),

  // Caption/helper text
  Caption: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn(
      "text-sm text-gray-500 dark:text-gray-400",
      className
    )} {...props}>
      {children}
    </span>
  ),

  // Label text
  Label: ({ children, className, ...props }: React.HTMLAttributes<HTMLLabelElement>) => (
    <label className={cn(
      "text-sm font-medium text-gray-700 dark:text-gray-200",
      className
    )} {...props}>
      {children}
    </label>
  ),
};

// Enhanced Card Component - Inspired by Stripe's clean cards
export const DesignCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  border?: boolean;
}> = ({ 
  children, 
  className, 
  padding = 'md', 
  shadow = 'sm',
  border = true 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 rounded-xl",
      paddingClasses[padding],
      shadowClasses[shadow],
      border && "border border-gray-200 dark:border-gray-700",
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      {children}
    </div>
  );
};

// Enhanced Button Component - Inspired by Intercom's approachable buttons
export const DesignButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  type = 'button'
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-sunset-500 hover:bg-sunset-600 text-white focus:ring-sunset-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white focus:ring-gray-500",
    ghost: "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300 focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
    >
      {children}
    </button>
  );
};

// Layout Container - Consistent spacing and max-widths
export const DesignContainer: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}> = ({ children, size = 'lg', className }) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8",
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

// Spacing System - Consistent vertical rhythm
export const spacing = {
  section: "mb-12 lg:mb-16",
  subsection: "mb-8",
  element: "mb-6",
  small: "mb-4",
  tight: "mb-2"
};
