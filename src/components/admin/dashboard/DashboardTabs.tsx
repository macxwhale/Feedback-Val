
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { UserManagement } from '../UserManagement';
import { OrganizationSpecificStats } from '../OrganizationSpecificStats';
import { OrganizationSettingsTab } from '../OrganizationSettingsTab';
import { QuestionsManagement } from '../QuestionsManagement';
import { AdvancedDashboardView } from './AdvancedDashboardView';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  organization: any;
  stats?: any;
  isLiveActivity: boolean;
  setIsLiveActivity: (isLive: boolean) => void;
  handleQuickActions: {
    onCreateQuestion: () => void;
    onInviteUser: () => void;
    onExportData: () => void;
    onViewSettings: () => void;
  };
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  organization,
  stats,
  isLiveActivity,
  setIsLiveActivity,
  handleQuickActions
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-5 w-full max-w-lg">
        {tabs.map(({ id, label, icon: Icon }) => (
          <TabsTrigger key={id} value={id} className="flex items-center space-x-2">
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <AdvancedDashboardView
          organizationId={organization.id}
          organizationName={organization.name}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
          isLiveActivity={isLiveActivity}
          setIsLiveActivity={setIsLiveActivity}
          handleQuickActions={handleQuickActions}
        />
      </TabsContent>

      <TabsContent value="members">
        <UserManagement 
          organizationId={organization.id}
          organizationName={organization.name}
        />
      </TabsContent>

      <TabsContent value="feedback">
        <OrganizationSpecificStats organizationId={organization.id} />
      </TabsContent>

      <TabsContent value="questions">
        <QuestionsManagement />
      </TabsContent>

      <TabsContent value="settings">
        <OrganizationSettingsTab organization={organization} />
      </TabsContent>
    </Tabs>
  );
};
