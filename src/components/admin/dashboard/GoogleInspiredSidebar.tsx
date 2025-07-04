
import React from 'react';
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
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
  Brain,
  Webhook,
  LogOut,
} from 'lucide-react';
import { EnhancedLoadingSpinner } from './EnhancedLoadingSpinner';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useNavigate } from 'react-router-dom';

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
  const { isMobile } = useMobileDetection();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});

  const groupedMenuItems = [
    {
      label: "Overview",
      items: [
        { id: 'overview', label: 'Dashboard', icon: BarChart3, badge: (stats?.growth_metrics?.growth_rate && stats.growth_metrics.growth_rate > 0 ? `+${stats.growth_metrics.growth_rate}%` : undefined) }
      ]
    },
    {
      label: "Analytics",
      items: [
        { id: 'customer-insights', label: 'Customer insights', icon: TrendingUp },
        { id: 'sentiment', label: 'Sentiment analysis', icon: Brain },
        { id: 'performance', label: 'Performance', icon: BarChart3 }
      ]
    },
    {
      label: "Content",
      items: [
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: stats?.total_responses || 0 },
        { id: 'questions', label: 'Questions', icon: MessageSquare, badge: stats?.total_questions || 0 }
      ]
    },
    {
      label: "Setup",
      items: [
        { id: 'members', label: 'Users and permissions', icon: Users, badge: stats?.active_members || 0 },
        { id: 'integrations', label: 'Integrations', icon: Webhook },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-base text-gray-900 dark:text-gray-100 truncate font-sans" title={organizationName}>
              {organizationName}
            </h2>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 py-2">
        {groupedMenuItems.map((section, idx) => {
          const isExpanded = isMobile ? expandedGroups[section.label] !== false : true;
          return (
            <SidebarGroup
              key={section.label}
              className={`px-3 ${idx !== 0 ? "mt-4" : "mt-0"}`}
            >
              <div
                className="flex items-center justify-between cursor-pointer select-none px-3 py-2"
                onClick={isMobile ? () => toggleGroup(section.label) : undefined}
              >
                <SidebarGroupLabel className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider font-sans">
                  {section.label}
                </SidebarGroupLabel>
              </div>
              <SidebarGroupContent className={isExpanded ? "block" : "hidden"}>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(item.id)}
                        isActive={activeTab === item.id}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded transition-all duration-200 font-sans text-sm
                          ${activeTab === item.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }
                        `}
                      >
                        <div className="flex items-center min-w-0">
                          <item.icon className={`h-4 w-4 mr-3 flex-shrink-0 ${
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
                              variant="secondary"
                              className={`ml-2 text-xs font-normal flex-shrink-0 ${
                                activeTab === item.id 
                                  ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300" 
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
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
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-sans h-9" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign out
        </Button>
      </div>
    </Sidebar>
  );
};
