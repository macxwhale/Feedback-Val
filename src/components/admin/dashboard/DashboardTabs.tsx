
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
import { tabSections } from './DashboardTabSections';
import { SectionLabel } from './SectionLabel';
import { AdvancedDashboardTab } from './tabs/AdvancedDashboardTab';
import { CustomerInsightsTab } from './tabs/CustomerInsightsTab';
import { SentimentTab } from './tabs/SentimentTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { MembersTab } from './tabs/MembersTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { QuestionsTab } from './tabs/QuestionsTab';
import { SettingsTab } from './tabs/SettingsTab';

export type DashboardModuleKey = 
  | 'overview'
  | 'customer-insights'
  | 'sentiment'
  | 'performance'
  | 'members'
  | 'feedback'
  | 'questions'
  | 'settings';

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

// Removed local SectionLabel definition to resolve naming conflict

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  organization,
  stats,
  isLiveActivity,
  setIsLiveActivity,
  handleQuickActions
}) => {
  // Grouped tabs definition
  const tabSections = [
    {
      label: 'Core Analytics',
      tabs: [
        { id: 'overview', label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      label: 'Customer Intelligence',
      tabs: [
        { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp },
        { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain },
        { id: 'performance', label: 'Performance', icon: BarChart3 }
      ]
    },
    {
      label: 'Content Management',
      tabs: [
        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        { id: 'questions', label: 'Questions', icon: MessageSquare }
      ]
    },
    {
      label: 'Team & Settings',
      tabs: [
        { id: 'members', label: 'Members', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    },
  ];

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {tabSections.map((section) => (
            <React.Fragment key={section.label}>
              <SectionLabel>{section.label}</SectionLabel>
              {section.tabs.map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </React.Fragment>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdvancedDashboardTab
            organization={organization}
            stats={stats}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLiveActivity={isLiveActivity}
            setIsLiveActivity={setIsLiveActivity}
            handleQuickActions={handleQuickActions}
          />
        </TabsContent>
        <TabsContent value="customer-insights">
          <CustomerInsightsTab organizationId={organization.id} />
        </TabsContent>
        <TabsContent value="sentiment">
          <SentimentTab organizationId={organization.id} />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceTab organizationId={organization.id} />
        </TabsContent>
        <TabsContent value="members">
          <MembersTab organization={organization} />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackTab organizationId={organization.id} />
        </TabsContent>
        <TabsContent value="questions">
          <QuestionsTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab organization={organization} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
