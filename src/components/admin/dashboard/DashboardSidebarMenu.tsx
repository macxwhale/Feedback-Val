
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
    <>
      {groupedMenuItems.map((section, idx) => {
        const isExpanded = isMobile ? expandedGroups[section.label] !== false : true;
        return (
          <SidebarGroup
            key={section.label}
            className={`px-3 ${idx !== 0 ? "mt-6" : "mt-2"}`}
          >
            <div
              className="flex items-center justify-between cursor-pointer select-none px-3 py-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200"
              onClick={isMobile ? () => toggleGroup(section.label) : undefined}
              tabIndex={isMobile ? 0 : -1}
              aria-label={section.label + " Menu"}
              aria-expanded={isExpanded}
            >
              <SidebarGroupLabel
                className="uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 text-xs pb-0 font-inter"
                style={{ letterSpacing: '0.08em' }}
              >
                {section.label}
              </SidebarGroupLabel>
              {isMobile && (
                isExpanded
                  ? <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                  : <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
              )}
            </div>
            <SidebarGroupContent className={isExpanded ? "block" : "hidden"}>
              <div className="mt-2 mb-3">
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(item.id)}
                        isActive={activeTab === item.id}
                        className={`flex items-center justify-between w-full px-4 py-3 gap-3 rounded-xl
                          transition-all duration-200 font-inter font-medium
                          ${isMobile ? "py-4 px-3 gap-4 text-base" : "text-sm"}
                          ${activeTab === item.id
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-blue-800/50 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                          }
                        `}
                        style={isMobile ? { minHeight: 52 } : undefined}
                      >
                        <div className="flex items-center min-w-0">
                          <item.icon className={`${isMobile ? "w-5 h-5" : "h-4 w-4"} mr-3 flex-shrink-0 ${
                            activeTab === item.id 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-500 dark:text-gray-400"
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isLoading ? (
                          <EnhancedLoadingSpinner size="sm" text="" className="ml-2 flex-shrink-0" />
                        ) : (
                          item.badge && (
                            <Badge 
                              variant={activeTab === item.id ? "default" : "secondary"} 
                              className={`ml-2 text-xs font-medium flex-shrink-0 ${
                                activeTab === item.id 
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" 
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )
                        )}
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
  )
}
