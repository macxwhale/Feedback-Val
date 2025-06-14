import React, { useState } from 'react';
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
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { UpgradePrompt } from './UpgradePrompt';
import { DashboardTabsDevPanel } from './DashboardTabsDevPanel';

// Define and EXPORT the DashboardModuleKey type
export type DashboardModuleKey =
  | "analytics"
  | "questions"
  | "settings"
  | "customerInsights"
  | "sentiment"
  | "performance"
  | "members"
  | "feedback";

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
  const { hasModuleAccess, plan } = useFeatureGate();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<null | string>(null);

  // ========= Diagnostics for Debugging =========
  const isDev = process.env.NODE_ENV !== 'production';

  // --- Context comparison debugging ---
  // Compare context org with prop org, and log in dev for troubleshooting
  let orgContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    orgContext = require('@/context/OrganizationContext').useOrganization().organization;
  } catch {
    orgContext = undefined;
  }
  if (typeof window !== "undefined" && isDev) {
    // Compare the organization's id, plan_type, features_config
    const pOrg = organization || {};
    const cOrg = orgContext || {};
    const idsMatch = pOrg.id && cOrg.id && pOrg.id === cOrg.id;
    const plansMatch = pOrg.plan_type === cOrg.plan_type;
    const featuresMatch = JSON.stringify(pOrg.features_config) === JSON.stringify(cOrg.features_config);
    console.groupCollapsed(
      "%c[DashboardTabs] ORG CONTEXT VS PROP",
      "background: #222; color: #ccf"
    );
    console.log("org from props:", { id: pOrg.id, plan_type: pOrg.plan_type, features_config: pOrg.features_config });
    console.log("org from context:", { id: cOrg.id, plan_type: cOrg.plan_type, features_config: cOrg.features_config });
    if (!idsMatch) console.warn("Organization ID mismatch between prop and context!");
    if (!plansMatch) console.warn("Organization plan_type mismatch between prop and context!");
    if (!featuresMatch) console.warn("Organization features_config mismatch between prop and context!");
    console.groupEnd();
  }

  // Strict module-typed tab config (no as any allowed anywhere)
  const tabs: {
    id: string;
    label: string;
    icon: React.ElementType;
    module: DashboardModuleKey;
  }[] = [
    { id: 'overview', label: 'Analytics', icon: BarChart3, module: "analytics" },
    { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp, module: "customerInsights" },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain, module: "sentiment" },
    { id: 'performance', label: 'Performance', icon: BarChart3, module: "performance" },
    { id: 'members', label: 'Members', icon: Users, module: "members" },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, module: "feedback" },
    { id: 'questions', label: 'Questions', icon: MessageSquare, module: "questions" },
    { id: 'settings', label: 'Settings', icon: Settings, module: "settings" },
  ];

  if (typeof window !== "undefined" && isDev) {
    console.groupCollapsed("%c[DashboardTabs] DEBUG TAB ACCESS", "background: #222;color: #eec321");
    console.log("activeTab:", activeTab);
    tabs.forEach(tab => {
      console.log(
        `[Tab: ${tab.label}] | module: "${tab.module}" | plan: "${plan}" | hasModuleAccess:`,
        hasModuleAccess(tab.module)
      );
    });
    console.groupEnd();
  }

  // --- no as any casting below! ---
  const tabAccess = tabs.map(tab => ({
    ...tab,
    accessible: hasModuleAccess(tab.module)
  }));

  // Locked tab gating
  const handleTabChange = (tabId: string) => {
    const tab = tabAccess.find(t => t.id === tabId);
    if (tab && !tab.accessible) {
      setShowUpgradePrompt(tab.label);
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div>
      {/* DEV: Separated debug panel */}
      <DashboardTabsDevPanel
        isDev={isDev}
        organization={organization}
        tabs={tabs}
        hasModuleAccess={hasModuleAccess}
      />
      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <UpgradePrompt lockedFeature={showUpgradePrompt} onClose={() => setShowUpgradePrompt(null)} />
      )}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {tabAccess.map(({ id, label, icon: Icon, accessible }) => (
            <TabsTrigger 
              key={id} 
              value={id} 
              className={`flex items-center space-x-2 ${!accessible ? 'opacity-60 cursor-pointer relative' : ''}`}
              disabled={!accessible}
              onClick={() => {
                if (!accessible) setShowUpgradePrompt(label);
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {!accessible && (
                <span className="ml-2 bg-yellow-200 text-yellow-800 rounded px-2 py-0.5 text-xs absolute -top-1 -right-1 pointer-events-none">
                  Upgrade
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* TabsContent is unchanged, still renders all content but inaccessible tabs are prevented */}
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
