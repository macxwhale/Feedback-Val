
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon,
    onRightIconClick,
    ...props 
  }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-input border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 transition-all duration-200",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "hover:border-gray-400",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400",
              "dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
              "dark:hover:border-gray-500 dark:disabled:bg-gray-900",
              LeftIcon && "pl-10",
              RightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {RightIcon && (
            <div 
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2",
                onRightIconClick && "cursor-pointer hover:text-gray-600"
              )}
              onClick={onRightIconClick}
            >
              <RightIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            "text-xs",
            error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
ModernInput.displayName = "ModernInput";

export { ModernInput };
