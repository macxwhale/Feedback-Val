
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/hooks/useOrganization';
import { DashboardTabsDevPanel } from './DashboardTabsDevPanel';

export type DashboardModuleKey = 
  | 'dashboard'
  | 'feedback'
  | 'users'
  | 'questions'
  | 'analytics'
  | 'settings'
  | 'integrations'
  | 'billing'
  | 'api';

interface DashboardTab {
  id: string;
  label: string;
  module: DashboardModuleKey;
  badge?: number;
}

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: DashboardTab[];
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  const { isAdmin } = useAuth();
  const { organization } = useOrganization();
  const [isDev] = useState(process.env.NODE_ENV === 'development');

  const hasModuleAccess = (module: DashboardModuleKey): boolean => {
    if (!organization?.features_config) return true;
    
    const features = organization.features_config;
    const planType = organization.plan_type || 'starter';
    
    // Basic access rules based on plan type
    const planAccess = {
      starter: ['dashboard', 'feedback', 'users', 'questions', 'analytics'],
      professional: ['dashboard', 'feedback', 'users', 'questions', 'analytics', 'integrations'],
      enterprise: ['dashboard', 'feedback', 'users', 'questions', 'analytics', 'integrations', 'settings', 'billing', 'api']
    };
    
    const allowedModules = planAccess[planType as keyof typeof planAccess] || planAccess.starter;
    
    // Check if module is in allowed list for plan
    if (!allowedModules.includes(module)) return false;
    
    // Check specific feature flags
    if (features.disable_analytics && module === 'analytics') return false;
    if (features.disable_integrations && module === 'integrations') return false;
    if (features.disable_api && module === 'api') return false;
    
    return true;
  };

  return (
    <div className="mb-6">
      <DashboardTabsDevPanel 
        isDev={isDev}
        organization={organization}
        tabs={tabs}
        hasModuleAccess={hasModuleAccess}
      />
      
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
        {tabs.map((tab) => {
          const isAccessible = hasModuleAccess(tab.module);
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => isAccessible && onTabChange(tab.id)}
              disabled={!isAccessible}
              className={`flex items-center space-x-2 ${
                isActive ? "bg-sunset-100 text-sunset-700" : "text-gray-500 hover:text-sunset-600"
              } ${!isAccessible ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {tab.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
