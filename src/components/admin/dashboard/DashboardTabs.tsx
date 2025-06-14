
import React, { Suspense } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { EnhancedUserManagement } from '../EnhancedUserManagement';
import { OrganizationSpecificStats } from '../OrganizationSpecificStats';
import { OrganizationSettingsTab } from '../OrganizationSettingsTab';
import { QuestionsManagement } from '../QuestionsManagement';
import { AdvancedDashboardView } from './AdvancedDashboardView';
import { CustomerInsightsDashboard } from './CustomerInsightsDashboard';
import { SentimentAnalyticsDashboard } from './SentimentAnalyticsDashboard';
import { PerformanceAnalyticsDashboard } from './PerformanceAnalyticsDashboard';
import { AdvancedDashboardTab } from './tabs/AdvancedDashboardTab';
import { CustomerInsightsTab } from './tabs/CustomerInsightsTab';
import { FeedbackTab } from './tabs/FeedbackTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { QuestionsTab } from './tabs/QuestionsTab';
import { SentimentTab } from './tabs/SentimentTab';
import { SettingsTab } from './tabs/SettingsTab';
const MembersTab = React.lazy(() => import('@/components/org-admin/dashboard/MembersTab'));

export type DashboardModuleKey =
  | 'overview'
  | 'customer-insights'
  | 'sentiment'
  | 'performance'
  | 'members'
  | 'feedback'
  | 'questions'
  | 'settings'
  | 'integrations';

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
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Removed hidden horizontal TabsList menu */}

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
          <Suspense fallback={<div>Loading members…</div>}>
            <MembersTab organization={organization} />
          </Suspense>
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
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
