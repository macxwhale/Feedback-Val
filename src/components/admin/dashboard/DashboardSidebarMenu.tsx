
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
              className="flex items-center justify-between cursor-pointer select-none px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={isMobile ? () => toggleGroup(section.label) : undefined}
              tabIndex={isMobile ? 0 : -1}
              aria-label={section.label + " Menu"}
              aria-expanded={isExpanded}
            >
              <SidebarGroupLabel className="uppercase font-semibold tracking-wider text-gray-500 text-xs">
                {section.label}
              </SidebarGroupLabel>
              {isMobile && (
                isExpanded
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <SidebarGroupContent className={isExpanded ? "block" : "hidden"}>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className={`
                        flex items-center justify-between w-full px-3 py-2.5 gap-3 rounded-lg
                        transition-all duration-200 font-medium text-sm
                        ${isMobile ? "py-3 px-3 gap-3 min-h-[44px]" : ""}
                        ${activeTab === item.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`${isMobile ? "w-5 h-5" : "h-4 w-4"} flex-shrink-0`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isLoading ? (
                        <EnhancedLoadingSpinner size="sm" text="" className="ml-2" />
                      ) : (
                        item.badge && (
                          <Badge 
                            variant={activeTab === item.id ? "default" : "secondary"} 
                            className={`
                              text-xs font-medium px-2 py-0.5 min-w-[20px] justify-center
                              ${activeTab === item.id 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-gray-100 text-gray-600 border-gray-200"
                              }
                            `}
                          >
                            {item.badge}
                          </Badge>
                        )
                      )}
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
