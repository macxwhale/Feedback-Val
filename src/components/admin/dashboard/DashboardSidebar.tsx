
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
  ChevronDown,
  ChevronRight,
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
import { DashboardSidebarMenu } from './DashboardSidebarMenu';
import { DashboardSidebarQuickStats } from './DashboardSidebarQuickStats';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useNavigate } from 'react-router-dom';

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
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  // For mobile: Store state of which groups are expanded
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});

  // Menu data stays here – ready to pass to <DashboardSidebarMenu />
  const groupedMenuItems = [
    {
      label: "Team & Settings",
      items: [
        { id: 'members', label: 'Members', icon: Users, badge: stats?.active_members || 0 },
        { id: 'integrations', label: 'Integrations', icon: Webhook },
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
    <Sidebar className="border-r bg-gray-50 dark:bg-sidebar-background rounded-xl shadow-sm transition-colors duration-200 flex flex-col">
      <SidebarHeader className="border-b p-4 bg-white dark:bg-sidebar-background rounded-t-xl">
        <h2 className="font-bold text-lg truncate" title={organizationName}>
          {organizationName}
        </h2>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <DashboardSidebarMenu
          groupedMenuItems={groupedMenuItems}
          isMobile={isMobile}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          activeTab={activeTab}
          onTabChange={onTabChange}
          isLoading={isLoading}
        />

        {/* Quick Stats */}
        {stats && !isLoading && (
          <DashboardSidebarQuickStats stats={stats} />
        )}
      </SidebarContent>
      <div className="p-4 border-t border-gray-200 dark:border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </Sidebar>
  );
};
