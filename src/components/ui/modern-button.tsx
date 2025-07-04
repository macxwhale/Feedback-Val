
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const modernButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Google Play Console inspired
        primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:bg-blue-800",
        
        // Secondary
        secondary: "bg-white text-gray-900 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md active:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700",
        
        // Success
        success: "bg-green-600 text-white shadow-sm hover:bg-green-700 hover:shadow-md active:bg-green-800",
        
        // Warning
        warning: "bg-orange-600 text-white shadow-sm hover:bg-orange-700 hover:shadow-md active:bg-orange-800",
        
        // Danger
        danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md active:bg-red-800",
        
        // Ghost
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        
        // Outline
        outline: "border border-gray-300 bg-transparent text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
        
        // Link
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  asChild?: boolean;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(modernButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ModernButton.displayName = "ModernButton";

export { ModernButton, modernButtonVariants };
