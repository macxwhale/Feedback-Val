
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  Settings, 
  User, 
  ChevronDown,
  Home,
  Users,
  BarChart3,
  MessageSquare,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernInput } from '@/components/ui/modern-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Navigation items configuration
const navigationItems = [
  {
    label: 'Overview',
    icon: Home,
    href: '/admin',
    active: true
  },
  {
    label: 'Organizations',
    icon: Shield,
    href: '/admin/organizations',
    badge: '12'
  },
  {
    label: 'Users',
    icon: Users,
    href: '/admin/users',
    badge: '248'
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics'
  },
  {
    label: 'Feedback',
    icon: MessageSquare,
    href: '/admin/feedback',
    badge: '5'
  }
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-nav",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-play rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Pulsify Admin
              </span>
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
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      isActive 
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
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex h-full items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <ModernInput
                placeholder="Search organizations, users, or data..."
                leftIcon={Search}
                className="w-full"
              />
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <ModernButton variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </ModernButton>

              {/* Settings */}
              <ModernButton variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </ModernButton>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ModernButton variant="ghost" className="flex items-center space-x-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        System Admin
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        admin@pulsify.com
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </ModernButton>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };
