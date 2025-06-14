import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, MessageSquare, Settings, TrendingUp, Brain } from 'lucide-react';
import { EnhancedLoadingSpinner } from './EnhancedLoadingSpinner';

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
  // Grouped menu items for sidebar
  const groupedMenuItems = [
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
    },
    {
      label: "Team & Settings",
      items: [
        { id: 'members', label: 'Members', icon: Users, badge: stats?.active_members || 0 },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b p-4">
        <h2 className="font-semibold text-lg truncate" title={organizationName}>
          {organizationName}
        </h2>
      </SidebarHeader>
      
      <SidebarContent>
        {groupedMenuItems.map(section => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
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
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Stats */}
        {stats && !isLoading && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">
                    {stats.total_sessions > 0 
                      ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Score</span>
                  <span className="font-medium">
                    {stats.avg_session_score || 0}/5
                  </span>
                </div>
                {stats.growth_metrics?.growth_rate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth</span>
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
