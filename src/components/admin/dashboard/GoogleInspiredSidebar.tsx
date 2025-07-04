
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
  Brain,
  Webhook,
} from 'lucide-react';

interface GoogleInspiredSidebarProps {
  organizationName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: any;
  isLoading?: boolean;
}

export const GoogleInspiredSidebar: React.FC<GoogleInspiredSidebarProps> = ({
  organizationName,
  activeTab,
  onTabChange,
  stats,
  isLoading = false
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'customer-insights', label: 'Customer insights', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment analysis', icon: Brain },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'members', label: 'Users and permissions', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white w-64">
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg mx-2
                      ${activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      activeTab === item.id 
                        ? "text-blue-600" 
                        : "text-gray-400"
                    }`} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
