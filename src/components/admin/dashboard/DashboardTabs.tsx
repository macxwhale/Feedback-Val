
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  TrendingUp,
  Brain
} from 'lucide-react';
import { EnhancedUserManagement } from '../EnhancedUserManagement';
import { OrganizationSpecificStats } from '../OrganizationSpecificStats';
import { OrganizationSettingsTab } from '../OrganizationSettingsTab';
import { QuestionsManagement } from '../QuestionsManagement';
import { AdvancedDashboardView } from './AdvancedDashboardView';
import { CustomerInsightsDashboard } from './CustomerInsightsDashboard';
import { SentimentAnalyticsDashboard } from './SentimentAnalyticsDashboard';
import { PerformanceAnalyticsDashboard } from './PerformanceAnalyticsDashboard';

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
    { id: 'overview', label: 'Analytics', icon: BarChart3 },
    { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id} 
              className="flex items-center space-x-2"
            >
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

        <TabsContent value="customer-insights">
          <CustomerInsightsDashboard organizationId={organization.id} />
        </TabsContent>

        <TabsContent value="sentiment">
          <SentimentAnalyticsDashboard organizationId={organization.id} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalyticsDashboard organizationId={organization.id} />
        </TabsContent>

        <TabsContent value="members">
          <EnhancedUserManagement 
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
    </div>
  );
};
