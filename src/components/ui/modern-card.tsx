
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Modern Card Variants
const cardVariants = {
  default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-card hover:shadow-lg transition-all duration-200",
  elevated: "bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 border-0",
  outlined: "bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200",
  glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-lg"
};

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
  hover?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = "default", hover = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card p-6",
        cardVariants[variant],
        hover && "hover:scale-[1.02] cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
ModernCard.displayName = "ModernCard";

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "red" | "purple";
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  className
}) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
  };

  return (
    <ModernCard className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <Badge 
                variant={trend.isPositive ? "default" : "secondary"}
                className="text-xs"
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </Badge>
              <span className="ml-2 text-xs text-gray-500">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={cn(
            "p-3 rounded-lg",
            colorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-current to-transparent" />
      </div>
    </ModernCard>
  );
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  action,
  className
}) => (
  <ModernCard 
    className={cn("group cursor-pointer", className)}
    onClick={action?.onClick}
  >
    <div className="flex items-start space-x-4">
      {Icon && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        
        {action && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            {action.label} →
          </p>
        )}
      </div>
    </div>
  </ModernCard>
);

export { ModernCard, MetricCard, ActionCard };
