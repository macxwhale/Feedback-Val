
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
  SidebarHeader,
  SidebarFooter
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
  Building2
} from 'lucide-react';
import { EnhancedLoadingSpinner } from './EnhancedLoadingSpinner';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { DashboardSidebarMenu } from './DashboardSidebarMenu';
import { DashboardSidebarQuickStats } from './DashboardSidebarQuickStats';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

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

  // Menu data with enhanced organization
  const groupedMenuItems = [
    {
      label: "Overview",
      items: [
        { id: 'overview', label: 'Analytics', icon: BarChart3, badge: (stats?.growth_metrics?.growth_rate && stats.growth_metrics.growth_rate > 0 ? `+${stats.growth_metrics.growth_rate}%` : undefined) }
      ]
    },
    {
      label: "Intelligence",
      items: [
        { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp },
        { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain },
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
      label: "Management",
      items: [
        { id: 'members', label: 'Team Members', icon: Users, badge: stats?.active_members || 0 },
        { id: 'integrations', label: 'Integrations', icon: Webhook },
        { id: 'settings', label: 'Settings', icon: Settings }
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
    <Sidebar className={cn(
      "bg-white border-r border-gray-200/50 shadow-lg",
      "flex flex-col transition-all duration-200"
    )}>
      <SidebarHeader className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-orange-50 to-orange-100/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 truncate" title={organizationName}>
              {organizationName}
            </h2>
            <p className="text-sm text-gray-600">Organization</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 p-3">
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
          <div className="mt-6">
            <DashboardSidebarQuickStats stats={stats} />
          </div>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200/50 bg-gray-50/50">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-600 hover:text-gray-900",
            "hover:bg-gray-100/80 transition-colors"
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
