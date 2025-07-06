
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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

  // Main navigation items with Material Design structure
  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: BarChart3, 
      badge: stats?.growth_metrics?.growth_rate > 0 ? `+${stats.growth_metrics.growth_rate}%` : undefined,
      description: 'Analytics overview'
    },
    { 
      id: 'members', 
      label: 'Team Members', 
      icon: Users, 
      badge: stats?.active_members || 0,
      description: 'User management'
    },
    { 
      id: 'feedback', 
      label: 'Customer Feedback', 
      icon: MessageSquare, 
      badge: stats?.total_responses || 0,
      description: 'Review responses'
    },
    { 
      id: 'questions', 
      label: 'Survey Questions', 
      icon: MessageSquare, 
      badge: stats?.total_questions || 0,
      description: 'Manage surveys'
    },
    { 
      id: 'customer-insights', 
      label: 'Customer Insights', 
      icon: TrendingUp,
      description: 'Advanced analytics'
    },
    { 
      id: 'sentiment', 
      label: 'Sentiment Analysis', 
      icon: Brain,
      description: 'AI insights'
    },
    { 
      id: 'performance', 
      label: 'Performance Metrics', 
      icon: BarChart3,
      description: 'System performance'
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: Webhook,
      description: 'Connected services'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      description: 'Configuration'
    }
  ];

  return (
    <Sidebar className="border-r-0 bg-surface elevation-1">
      {/* Material Design header */}
      <SidebarHeader className="p-0 border-b border-outline-variant">
        <div className="p-6">
          <div className="flex items-center gap-3">
            {/* Google-style app icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center elevation-2">
              <span className="text-white font-medium text-lg">P</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-title-large text-on-surface font-medium">
                Pulsify
              </h1>
              <p className="text-body-small text-on-surface-variant">
                Analytics Console
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "material-nav-item w-full h-14 px-4 rounded-full transition-all duration-200 group relative",
                        "flex items-center justify-start",
                        "hover:bg-primary/8 hover:text-primary",
                        "focus:bg-primary/12 focus:text-primary",
                        "focus:outline-none",
                        isActive && [
                          "bg-primary/12 text-primary",
                          "shadow-sm",
                          "active"
                        ]
                      )}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <div className={cn(
                          "w-6 h-6 mr-4 shrink-0 transition-colors flex items-center justify-center",
                          isActive 
                            ? "text-primary" 
                            : "text-on-surface-variant group-hover:text-primary"
                        )}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={cn(
                            "text-label-large truncate",
                            isActive 
                              ? "text-primary font-medium" 
                              : "text-on-surface group-hover:text-primary"
                          )}>
                            {item.label}
                          </div>
                          {!isMobile && (
                            <div className={cn(
                              "text-body-small truncate mt-0.5",
                              isActive 
                                ? "text-primary/80" 
                                : "text-on-surface-variant group-hover:text-primary/80"
                            )}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-3">
                        {isLoading ? (
                          <EnhancedLoadingSpinner size="sm" text="" className="w-4 h-4" />
                        ) : (
                          item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-label-small px-2 py-0.5 min-w-0 shrink-0 rounded-full",
                                isActive 
                                  ? "bg-primary/20 text-primary border-primary/20" 
                                  : "bg-surface-container text-on-surface-variant border-outline-variant"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Material Design footer */}
      <div className="p-4 border-t border-outline-variant mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-4" />
          <span className="text-label-large">Sign out</span>
        </Button>
      </div>
    </Sidebar>
  );
};
