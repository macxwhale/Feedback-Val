
import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, Filter } from "lucide-react";
import { ModernButton } from "./modern-button";
import { Badge } from "./badge";

interface SearchFilter {
  key: string;
  label: string;
  value: any;
}

interface ModernSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  filters?: SearchFilter[];
  onRemoveFilter?: (key: string) => void;
  onFilterClick?: () => void;
  className?: string;
}

const ModernSearch: React.FC<ModernSearchProps> = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onClear,
  filters = [],
  onRemoveFilter,
  onFilterClick,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 bg-white text-sm text-gray-900",
            "placeholder:text-gray-500 transition-all duration-200",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "hover:border-gray-400",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400",
            "dark:focus:border-blue-400 dark:focus:ring-blue-400/20 dark:hover:border-gray-500"
          )}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <button
              onClick={onClear}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          
          {onFilterClick && (
            <ModernButton
              variant="ghost"
              size="icon-sm"
              onClick={onFilterClick}
              className="relative"
            >
              <Filter className="h-4 w-4" />
              {filters.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {filters.length}
                </span>
              )}
            </ModernButton>
          )}
        </div>
      </div>
      
      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-xs">
                {filter.label}: {filter.value}
              </span>
              {onRemoveFilter && (
                <button
                  onClick={() => onRemoveFilter(filter.key)}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export { ModernSearch };
