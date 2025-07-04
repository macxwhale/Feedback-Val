
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
  SidebarTrigger
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

  // Enhanced menu data with better organization
  const groupedMenuItems = [
    {
      label: "Analytics & Insights",
      items: [
        { 
          id: 'overview', 
          label: 'Overview', 
          icon: BarChart3, 
          badge: (stats?.growth_metrics?.growth_rate && stats.growth_metrics.growth_rate > 0 ? `+${stats.growth_metrics.growth_rate}%` : undefined),
          description: 'Key metrics and performance'
        },
        { 
          id: 'customer-insights', 
          label: 'Customer Insights', 
          icon: TrendingUp,
          description: 'Customer behavior analysis'
        },
        { 
          id: 'sentiment', 
          label: 'Sentiment Analysis', 
          icon: Brain,
          description: 'Feedback sentiment trends'
        },
        { 
          id: 'performance', 
          label: 'Performance', 
          icon: BarChart3,
          description: 'System performance metrics'
        }
      ]
    },
    {
      label: "Content & Feedback",
      items: [
        { 
          id: 'feedback', 
          label: 'Feedback', 
          icon: MessageSquare, 
          badge: stats?.total_responses || 0,
          description: 'Customer feedback responses'
        },
        { 
          id: 'questions', 
          label: 'Questions', 
          icon: MessageSquare, 
          badge: stats?.total_questions || 0,
          description: 'Survey question management'
        }
      ]
    },
    {
      label: "Administration",
      items: [
        { 
          id: 'members', 
          label: 'Team Members', 
          icon: Users, 
          badge: stats?.active_members || 0,
          description: 'User management and roles'
        },
        { 
          id: 'integrations', 
          label: 'Integrations', 
          icon: Webhook,
          description: 'Third-party connections'
        },
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: Settings,
          description: 'Organization configuration'
        }
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
    <Sidebar className="border-r-0 bg-white shadow-lg">
      <SidebarHeader className="border-b border-gray-100 p-6 bg-gradient-to-r from-orange-50 to-orange-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {organizationName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 truncate" title={organizationName}>
                {organizationName}
              </h2>
              <p className="text-xs text-gray-600">Organization Dashboard</p>
            </div>
          </div>
          <SidebarTrigger className="h-8 w-8 hover:bg-orange-100 transition-colors" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 py-6">
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
      
      <div className="p-4 border-t border-gray-100">
        <Button 
          variant="ghost" 
          className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-colors group" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3 group-hover:text-red-600 transition-colors" />
          <span>Sign Out</span>
        </Button>
      </div>
    </Sidebar>
  );
};
