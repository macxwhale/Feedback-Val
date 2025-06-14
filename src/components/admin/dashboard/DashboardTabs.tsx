
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
  // Visible debug block for org plan/features_config
  const isDev = process.env.NODE_ENV !== 'production';

  // Tab configuration w/ gating info (camelCase - exactly matching PLAN_FEATURE_MATRIX)
  const tabs = [
    { id: 'overview', label: 'Analytics', icon: BarChart3, module: 'analytics' },
    { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp, module: 'customerInsights' },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain, module: 'sentiment' },
    { id: 'performance', label: 'Performance', icon: BarChart3, module: 'performance' },
    { id: 'members', label: 'Members', icon: Users, module: 'members' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, module: 'feedback' },
    { id: 'questions', label: 'Questions', icon: MessageSquare, module: 'questions' },
    { id: 'settings', label: 'Settings', icon: Settings, module: 'settings' },
  ];

  // Add console log for each module access
  if (typeof window !== "undefined") {
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

  const tabAccess = tabs.map(tab => ({
    ...tab,
    accessible: hasModuleAccess(tab.module as any)
  }));

  // If user tries to activate a locked tab, show the upgrade modal instead
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
      {/* DEV: Show detailed module access for each tab */}
      {isDev && (
        <div className="mb-3 text-xs px-2 py-2 bg-yellow-50 border border-yellow-200 rounded flex flex-col gap-2">
          <div>
            <span className="font-bold">DEBUG:</span> plan_type: <span className="font-mono">{organization?.plan_type ?? "N/A"}</span>
            {' | '}
            features_config: <span className="font-mono break-all">{organization?.features_config ? JSON.stringify(organization.features_config) : "N/A"}</span>
          </div>
          <div className="mt-2">
            <table className="table-auto w-full border text-[11px]">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Tab</th>
                  <th className="border px-2 py-1">Module Key</th>
                  <th className="border px-2 py-1">Accessible?</th>
                  <th className="border px-2 py-1">hasModuleAccess Result</th>
                </tr>
              </thead>
              <tbody>
                {tabs.map(tab => (
                  <tr key={tab.id}>
                    <td className="border px-2 py-1">{tab.label} ({tab.id})</td>
                    <td className="border px-2 py-1">{tab.module}</td>
                    <td className={`border px-2 py-1 font-bold ${hasModuleAccess(tab.module as any) ? 'text-green-700' : 'text-red-700'}`}>
                      {hasModuleAccess(tab.module as any) ? 'YES' : 'NO'}
                    </td>
                    <td className="border px-2 py-1">
                      <code>
                        {String(hasModuleAccess(tab.module as any))}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
                if (!accessible) {
                  setShowUpgradePrompt(label);
                }
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

