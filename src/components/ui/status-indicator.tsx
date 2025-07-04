
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "dot" | "badge" | "full";
  className?: string;
}

const statusConfig: Record<StatusType, {
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  success: {
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-700 dark:text-green-300"
  },
  warning: {
    color: "bg-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    textColor: "text-orange-700 dark:text-orange-300"
  },
  error: {
    color: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300"
  },
  info: {
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300"
  },
  neutral: {
    color: "bg-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-300"
  }
};

const sizeConfig = {
  sm: {
    dot: "h-2 w-2",
    text: "text-xs",
    padding: "px-2 py-1",
    icon: "h-3 w-3"
  },
  md: {
    dot: "h-3 w-3",
    text: "text-sm",
    padding: "px-3 py-1.5",
    icon: "h-4 w-4"
  },
  lg: {
    dot: "h-4 w-4",
    text: "text-base",
    padding: "px-4 py-2",
    icon: "h-5 w-5"
  }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  icon: Icon,
  size = "md",
  variant = "badge",
  className
}) => {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  if (variant === "dot") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className={cn(
          "rounded-full animate-pulse",
          config.color,
          sizeStyles.dot
        )} />
        <span className={cn(
          "font-medium",
          config.textColor,
          sizeStyles.text
        )}>
          {label}
        </span>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <span className={cn(
        "inline-flex items-center rounded-full font-medium",
        config.bgColor,
        config.textColor,
        sizeStyles.text,
        sizeStyles.padding,
        className
      )}>
        <div className={cn(
          "rounded-full mr-1.5",
          config.color,
          sizeStyles.dot
        )} />
        {label}
      </span>
    );
  }

  // Full variant
  return (
    <div className={cn(
      "inline-flex items-center space-x-2 rounded-lg font-medium",
      config.bgColor,
      config.textColor,
      sizeStyles.padding,
      className
    )}>
      {Icon ? (
        <Icon className={cn(config.textColor, sizeStyles.icon)} />
      ) : (
        <div className={cn(
          "rounded-full",
          config.color,
          sizeStyles.dot
        )} />
      )}
      <span className={sizeStyles.text}>
        {label}
      </span>
    </div>
  );
};

export { StatusIndicator };
