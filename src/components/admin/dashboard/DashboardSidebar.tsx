
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
  Brain
} from 'lucide-react';
import { EnhancedLoadingSpinner } from './EnhancedLoadingSpinner';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface DashboardSidebarProps {
  organizationName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: any;
  isLoading?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  organizationName,
  activeTab,
  onTabChange,
  stats,
  isLoading = false
}) => {
  const { isMobile } = useMobileDetection();

  // For mobile: Store state of which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Reordered side navigation groups:
  const groupedMenuItems = [
    {
      label: "Team & Settings",
      items: [
        { id: 'members', label: 'Members', icon: Users, badge: stats?.active_members || 0 },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    },
    {
      label: "Core Analytics",
      items: [
        { id: 'overview', label: 'Analytics', icon: BarChart3, badge: (stats?.growth_metrics?.growth_rate && stats.growth_metrics.growth_rate > 0 ? `+${stats.growth_metrics.growth_rate}%` : undefined) }
      ]
    },
    {
      label: "Customer Intelligence",
      items: [
        { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp },
        { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain },
        { id: 'performance', label: 'Performance', icon: BarChart3 }
      ]
    },
    {
      label: "Content Management",
      items: [
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: stats?.total_responses || 0 },
        { id: 'questions', label: 'Questions', icon: MessageSquare, badge: stats?.total_questions || 0 }
      ]
    }
  ];

  // Handler for toggling group visibility on mobile
  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <Sidebar className="border-r bg-gray-50 dark:bg-sidebar-background rounded-xl shadow-sm transition-colors duration-200">
      <SidebarHeader className="border-b p-4 bg-white dark:bg-sidebar-background rounded-t-xl">
        <h2 className="font-bold text-lg truncate" title={organizationName}>
          {organizationName}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        {groupedMenuItems.map((section, idx) => {
          // Only mobile: allow group toggle
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
                  style={{
                    letterSpacing: '0.05em',
                  }}
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
                          onClick={() => {
                            onTabChange(item.id);
                          }}
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

        {/* Quick Stats */}
        {stats && !isLoading && (
          <SidebarGroup className="pt-5 mt-6 border-t border-gray-200 dark:border-sidebar-border px-3">
            <SidebarGroupLabel className="uppercase font-extrabold tracking-wider text-orange-700 dark:text-sidebar-accent text-xs pb-1">
              Quick Stats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2 bg-orange-50/80 dark:bg-sidebar-accent/50 rounded-lg shadow-xs">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-200">Completion Rate</span>
                  <span className="font-medium">
                    {stats.total_sessions > 0
                      ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-200">Avg Score</span>
                  <span className="font-medium">
                    {stats.avg_session_score || 0}/5
                  </span>
                </div>
                {stats.growth_metrics?.growth_rate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-200">Growth</span>
                    <span className={`font-medium flex items-center ${
                      stats.growth_metrics.growth_rate > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stats.growth_metrics.growth_rate}%
                    </span>
                  </div>
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
