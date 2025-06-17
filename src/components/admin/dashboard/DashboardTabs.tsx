
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeedbackTab } from "./tabs/FeedbackTab";
import { QuestionsTab } from "./tabs/QuestionsTab";
import { PerformanceTab } from "./tabs/PerformanceTab";
import { SentimentTab } from "./tabs/SentimentTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { SystemTab } from "./tabs/SystemTab";
import MembersTab from "../../org-admin/dashboard/MembersTab";
import { useAuthState } from "@/hooks/useAuthState";

export type DashboardModuleKey = 'feedback' | 'questions' | 'members' | 'performance' | 'sentiment' | 'settings' | 'system';

interface DashboardTabsProps {
  organization: any;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  stats?: any;
  isLiveActivity?: boolean;
  setIsLiveActivity?: (isLive: boolean) => void;
  handleQuickActions?: {
    onCreateQuestion: () => void;
    onViewSettings: () => void;
    onInviteUser: () => void;
    onExportData: () => void;
  };
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  organization, 
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab 
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState("feedback");
  const { isSuperAdmin } = useAuthState();

  // Use external state if provided, otherwise use internal state
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;

  const tabCount = isSuperAdmin ? 7 : 6;
  const gridCols = isSuperAdmin ? "grid-cols-7" : "grid-cols-6";

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`grid w-full ${gridCols} lg:${gridCols}`}>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        {isSuperAdmin && <TabsTrigger value="system">System</TabsTrigger>}
      </TabsList>

      <TabsContent value="feedback" className="mt-6">
        <FeedbackTab organizationId={organization.id} />
      </TabsContent>

      <TabsContent value="questions" className="mt-6">
        <QuestionsTab />
      </TabsContent>

      <TabsContent value="members" className="mt-6">
        <MembersTab organization={organization} />
      </TabsContent>

      <TabsContent value="performance" className="mt-6">
        <PerformanceTab organizationId={organization.id} />
      </TabsContent>

      <TabsContent value="sentiment" className="mt-6">
        <SentimentTab organizationId={organization.id} />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <SettingsTab organization={organization} />
      </TabsContent>

      {isSuperAdmin && (
        <TabsContent value="system" className="mt-6">
          <SystemTab />
        </TabsContent>
      )}
    </Tabs>
  );
};
