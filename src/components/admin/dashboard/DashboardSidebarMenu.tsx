
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
            className={`px-2 ${idx !== 0 ? "mt-5 pt-5 border-t border-gray-200 dark:border-sidebar-border" : ""}`}
          >
            <div
              className="flex items-center justify-between cursor-pointer select-none px-2"
              onClick={isMobile ? () => toggleGroup(section.label) : undefined}
              tabIndex={isMobile ? 0 : -1}
              aria-label={section.label + " Menu"}
              aria-expanded={isExpanded}
            >
              <SidebarGroupLabel
                className="uppercase font-extrabold tracking-wider text-orange-700 dark:text-sidebar-accent text-xs pb-1"
                style={{ letterSpacing: '0.05em' }}
              >
                {section.label}
              </SidebarGroupLabel>
              {isMobile && (
                isExpanded
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <SidebarGroupContent className={isExpanded ? "block" : "hidden"}>
              <div className="bg-white dark:bg-sidebar-accent rounded-lg mt-1 mb-2 shadow-xs transition-colors duration-150">
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(item.id)}
                        isActive={activeTab === item.id}
                        className={`flex items-center justify-between w-full px-3 py-2 gap-2 rounded-md
                          transition-colors duration-150
                          ${isMobile ? "py-3 px-2 gap-3" : ""}
                          hover:bg-orange-50 dark:hover:bg-sidebar-ring/10
                          focus-visible:bg-orange-100 dark:focus-visible:bg-sidebar-ring/15
                          ${activeTab === item.id
                            ? "bg-orange-100 dark:bg-sidebar-ring/20 font-semibold shadow-inner"
                            : ""
                          }
                        `}
                        style={isMobile ? { minHeight: 48, fontSize: 16 } : undefined}
                      >
                        <div className="flex items-center">
                          <item.icon className={`mr-2 ${isMobile ? "w-5 h-5" : "h-4 w-4"}`} />
                          <span>{item.label}</span>
                        </div>
                        {isLoading ? (
                          <EnhancedLoadingSpinner size="sm" text="" className="ml-2" />
                        ) : (
                          item.badge && (
                            <Badge variant="secondary" className="ml-2">
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
