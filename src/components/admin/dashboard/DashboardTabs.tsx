
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardTabsDevPanel } from './DashboardTabsDevPanel';

export type DashboardModuleKey = 'overview' | 'users' | 'questions' | 'responses' | 'analytics' | 'integrations' | 'billing' | 'settings';

export interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  organization?: any;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  onTabChange,
  organization 
}) => {
  const availableModules: DashboardModuleKey[] = [
    'overview',
    'users', 
    'questions',
    'responses',
    'analytics',
    'integrations',
    'billing',
    'settings'
  ];

  const getTabLabel = (module: DashboardModuleKey): string => {
    const labels = {
      overview: 'Overview',
      users: 'Users',
      questions: 'Questions',
      responses: 'Responses', 
      analytics: 'Analytics',
      integrations: 'Integrations',
      billing: 'Billing',
      settings: 'Settings'
    };
    return labels[module];
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        {availableModules.map((module) => (
          <TabsTrigger 
            key={module} 
            value={module}
            className="text-sm"
          >
            {getTabLabel(module)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {availableModules.map((module) => (
        <TabsContent key={module} value={module} className="mt-6">
          <DashboardTabsDevPanel 
            module={module}
            organization={organization}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
