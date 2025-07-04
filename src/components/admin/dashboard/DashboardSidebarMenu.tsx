
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
    <div className="space-y-6">
      {groupedMenuItems.map((section, idx) => {
        const isExpanded = isMobile ? expandedGroups[section.label] !== false : true;
        return (
          <SidebarGroup key={section.label} className="space-y-2">
            <div
              className={cn(
                "flex items-center justify-between px-2 py-1 rounded-lg",
                "cursor-pointer select-none transition-colors",
                isMobile && "hover:bg-gray-100/50"
              )}
              onClick={isMobile ? () => toggleGroup(section.label) : undefined}
              tabIndex={isMobile ? 0 : -1}
              aria-label={section.label + " Menu"}
              aria-expanded={isExpanded}
            >
              <SidebarGroupLabel className={cn(
                "text-xs font-bold tracking-wider text-gray-500 uppercase",
                "group-hover:text-gray-700 transition-colors"
              )}>
                {section.label}
              </SidebarGroupLabel>
              {isMobile && (
                <div className="p-1">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              )}
            </div>
            
            <SidebarGroupContent className={cn(
              "transition-all duration-200",
              isExpanded ? "block" : "hidden"
            )}>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2.5 rounded-lg",
                        "transition-all duration-200 group",
                        isMobile && "py-3 px-3 min-h-[48px]",
                        // Active state
                        activeTab === item.id ? [
                          "bg-gradient-to-r from-orange-500 to-orange-600",
                          "text-white shadow-lg",
                          "border-0"
                        ] : [
                          "text-gray-700 hover:text-gray-900",
                          "hover:bg-gray-100/80 active:bg-gray-200/50",
                          "border border-transparent hover:border-gray-200/50"
                        ]
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn(
                          "transition-all duration-200",
                          isMobile ? "w-5 h-5" : "w-4 h-4",
                          activeTab === item.id ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                        )} />
                        <span className={cn(
                          "font-medium transition-colors",
                          isMobile && "text-base"
                        )}>
                          {item.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isLoading ? (
                          <EnhancedLoadingSpinner size="sm" text="" className="w-4 h-4" />
                        ) : (
                          item.badge && (
                            <Badge 
                              variant={activeTab === item.id ? "secondary" : "secondary"}
                              className={cn(
                                "text-xs font-semibold",
                                activeTab === item.id ? [
                                  "bg-white/20 text-white border-white/20"
                                ] : [
                                  "bg-gray-100 text-gray-600 border-gray-200"
                                ]
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
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </div>
  );
};
