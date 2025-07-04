
import React, { useState } from 'react';
import { ModernCard, MetricCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernInput } from '@/components/ui/modern-input';
import { ModernSearch } from '@/components/ui/modern-search';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Plus,
  Bell,
  Search,
  Menu,
  Home,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernDashboardLayoutProps {
  organizationName: string;
  organizationId: string;
  children: React.ReactNode;
  stats?: {
    active_members: number;
    total_responses: number;
    total_sessions: number;
    avg_session_score: number;
    growth_metrics?: {
      growth_rate: number;
    };
  };
}

const navigationSections = [
  {
    title: "Overview",
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, active: true },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: '12' },
    ]
  },
  {
    title: "Content & Feedback",
    items: [
      { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: '248' },
      { id: 'questions', label: 'Questions', icon: MessageSquare },
    ]
  },
  {
    title: "Team & Settings",
    items: [
      { id: 'members', label: 'Members', icon: Users, badge: '15' },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

export const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
  organizationName,
  organizationId,
  children,
  stats
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-nav",
        sidebarCollapsed ? "w-16" : "w-72"
      )}>
        {/* Organization Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-play rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {organizationName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate max-w-[180px]">
                  {organizationName}
                </h1>
                <StatusIndicator status="success" label="Active" size="sm" variant="dot" />
              </div>
            </div>
          )}
          
          <ModernButton
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto"
          >
            <Menu className="h-4 w-4" />
          </ModernButton>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h2>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        item.active 
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-300" 
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        !sidebarCollapsed && "mr-3"
                      )} />
                      
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Quick Stats in Sidebar */}
        {!sidebarCollapsed && stats && (
          <div className="absolute bottom-6 left-3 right-3">
            <ModernCard className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Members</span>
                  <span className="text-sm font-semibold">{stats.active_members}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Responses</span>
                  <span className="text-sm font-semibold">{stats.total_responses}</span>
                </div>
                {stats.growth_metrics?.growth_rate && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Growth</span>
                    <span className="text-sm font-semibold text-green-600">
                      +{stats.growth_metrics.growth_rate}%
                    </span>
                  </div>
                )}
              </div>
            </ModernCard>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-16" : "ml-72"
      )}>
        {/* Modern Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-full items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <ModernSearch
                placeholder="Search feedback, users, or analytics..."
                value={searchValue}
                onChange={setSearchValue}
                onClear={() => setSearchValue('')}
                className="w-full"
              />
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <ModernButton variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </ModernButton>

              <ModernButton size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Quick Action</span>
              </ModernButton>

              <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-gray-700">
                <div className="h-8 w-8 bg-gradient-play rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Organization</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
