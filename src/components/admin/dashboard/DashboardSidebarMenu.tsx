
import React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { EnhancedLoadingSpinner } from './EnhancedLoadingSpinner';
import { cn } from '@/lib/utils';

interface MenuSection {
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    description?: string;
  }[];
}

interface DashboardSidebarMenuProps {
  groupedMenuItems: MenuSection[];
  isMobile: boolean;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (sectionLabel: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoading: boolean;
}

export const DashboardSidebarMenu: React.FC<DashboardSidebarMenuProps> = ({
  groupedMenuItems,
  isMobile,
  expandedGroups,
  toggleGroup,
  activeTab,
  onTabChange,
  isLoading
}) => {
  return (
    <>
      {groupedMenuItems.map((section, idx) => {
        const isExpanded = isMobile ? expandedGroups[section.label] !== false : true;
        return (
          <SidebarGroup
            key={section.label}
            className={cn(
              "px-4",
              idx !== 0 && "mt-8 pt-6 border-t border-gray-100"
            )}
          >
            <div
              className="flex items-center justify-between cursor-pointer select-none py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={isMobile ? () => toggleGroup(section.label) : undefined}
              tabIndex={isMobile ? 0 : -1}
              aria-label={section.label + " Menu"}
              aria-expanded={isExpanded}
            >
              <SidebarGroupLabel className="uppercase font-bold tracking-wider text-gray-600 text-xs">
                {section.label}
              </SidebarGroupLabel>
              {isMobile && (
                isExpanded
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <SidebarGroupContent className={cn(
              "transition-all duration-200",
              isExpanded ? "block opacity-100" : "hidden opacity-0"
            )}>
              <div className="mt-2 space-y-1">
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(item.id)}
                        isActive={activeTab === item.id}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 gap-3 rounded-xl group",
                          "transition-all duration-200 ease-in-out",
                          isMobile && "py-4 px-3 text-base",
                          "hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:shadow-sm",
                          "focus-visible:bg-gradient-to-r focus-visible:from-orange-100 focus-visible:to-orange-200/50",
                          activeTab === item.id && [
                            "bg-gradient-to-r from-orange-100 to-orange-200/50",
                            "text-orange-900 font-semibold shadow-sm border border-orange-200/50",
                            "relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                            "before:w-1 before:h-8 before:bg-orange-500 before:rounded-r-full"
                          ]
                        )}
                        style={isMobile ? { minHeight: 56 } : undefined}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <item.icon className={cn(
                            "flex-shrink-0 mr-3 transition-colors",
                            isMobile ? "w-5 h-5" : "h-4 w-4",
                            activeTab === item.id 
                              ? "text-orange-600" 
                              : "text-gray-500 group-hover:text-orange-500"
                          )} />
                          <div className="min-w-0 flex-1">
                            <span className={cn(
                              "block truncate",
                              activeTab === item.id ? "text-orange-900" : "text-gray-700"
                            )}>
                              {item.label}
                            </span>
                            {item.description && !isMobile && (
                              <span className="block text-xs text-gray-500 mt-0.5 truncate">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center flex-shrink-0">
                          {isLoading ? (
                            <EnhancedLoadingSpinner size="sm" text="" className="w-4 h-4" />
                          ) : (
                            item.badge && (
                              <Badge 
                                variant={activeTab === item.id ? "default" : "secondary"} 
                                className={cn(
                                  "text-xs font-medium",
                                  activeTab === item.id 
                                    ? "bg-orange-500 text-white shadow-sm" 
                                    : "bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
};
