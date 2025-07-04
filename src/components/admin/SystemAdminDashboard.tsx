
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllOrganizations } from '@/services/organizationQueries';
import { ModernCard, MetricCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernSearch } from '@/components/ui/modern-search';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  BarChart3, 
  Shield,
  Activity,
  Settings,
  Plus,
  Bell,
  Menu,
  Home,
  Code,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemOverviewDashboard } from './system/SystemOverviewDashboard';
import { SystemOrganizationsList } from './system/SystemOrganizationsList';
import { SystemUserManagement } from './system/SystemUserManagement';
import { SystemSettingsPanel } from './system/SystemSettingsPanel';
import { SystemIntegrationsPanel } from './system/SystemIntegrationsPanel';

const navigationSections = [
  {
    title: "System Overview",
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'analytics', label: 'System Analytics', icon: BarChart3, badge: 'NEW' },
    ]
  },
  {
    title: "Management",
    items: [
      { id: 'organizations', label: 'Organizations', icon: Building2, badge: '12' },
      { id: 'users', label: 'Users', icon: Users, badge: '248' },
      { id: 'permissions', label: 'Permissions', icon: Shield },
    ]
  },
  {
    title: "System & Settings",
    items: [
      { id: 'integrations', label: 'API Settings', icon: Code },
      { id: 'system-settings', label: 'System Settings', icon: Settings },
      { id: 'monitoring', label: 'Monitoring', icon: Activity },
    ]
  }
];

export const SystemAdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganizations,
  });

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'organizations':
        return <SystemOrganizationsList organizations={organizations} />;
      case 'users':
        return <SystemUserManagement organizations={organizations} />;
      case 'system-settings':
        return <SystemSettingsPanel />;
      case 'integrations':
        return <SystemIntegrationsPanel />;
      default:
        return <SystemOverviewDashboard organizations={organizations} />;
    }
  };

  // Calculate total users from organizations count (placeholder calculation)
  const totalUsers = organizations.length * 8; // Approximate users per org
  const activeOrgs = organizations.filter(org => org.is_active).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-nav",
        sidebarCollapsed ? "w-16" : "w-72"
      )}>
        {/* System Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-play rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  System Admin
                </h1>
                <StatusIndicator status="success" label="Online" size="sm" variant="dot" />
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
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        activeSection === item.id
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
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Quick System Stats */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-6 left-3 right-3">
            <ModernCard className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                System Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Organizations</span>
                  <span className="text-sm font-semibold">{activeOrgs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Total Users</span>
                  <span className="text-sm font-semibold">{totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className="text-sm font-semibold text-green-600">Healthy</span>
                </div>
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
                placeholder="Search organizations, users, or system data..."
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
                  2
                </span>
              </ModernButton>

              <ModernButton size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>System Action</span>
              </ModernButton>

              <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-gray-700">
                <div className="h-8 w-8 bg-gradient-play rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">System Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Super User</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
