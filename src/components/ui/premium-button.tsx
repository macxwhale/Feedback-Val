
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const premiumButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25',
          'hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/30',
          'active:from-orange-700 active:to-orange-800 active:scale-[0.98]'
        ],
        secondary: [
          'bg-gray-100 text-gray-900 hover:bg-gray-200',
          'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
          'shadow-sm hover:shadow-md active:scale-[0.98]'
        ],
        outline: [
          'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
          'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
          'shadow-sm hover:shadow-md active:scale-[0.98]'
        ],
        ghost: [
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          'active:scale-[0.98]'
        ],
        destructive: [
          'bg-red-500 text-white shadow-lg shadow-red-500/25',
          'hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30',
          'active:bg-red-700 active:scale-[0.98]'
        ],
        link: 'text-orange-600 underline-offset-4 hover:underline dark:text-orange-400'
      },
      size: {
        sm: 'h-9 rounded-lg px-3 text-xs',
        default: 'h-11 rounded-xl px-6',
        lg: 'h-13 rounded-xl px-8 text-base',
        xl: 'h-16 rounded-2xl px-10 text-lg',
        icon: 'h-11 w-11 rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(premiumButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
PremiumButton.displayName = 'PremiumButton';

export { PremiumButton, premiumButtonVariants };
