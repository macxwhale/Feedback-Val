
import React from "react";
import { AdvancedDashboardView } from '../AdvancedDashboardView';

interface AdvancedDashboardTabProps {
  organization: any;
  stats?: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLiveActivity: boolean;
  setIsLiveActivity: (isLive: boolean) => void;
  handleQuickActions: {
    onCreateQuestion: () => void;
    onInviteUser: () => void;
    onExportData: () => void;
    onViewSettings: () => void;
  };
}

export const AdvancedDashboardTab: React.FC<AdvancedDashboardTabProps> = ({
  organization,
  stats,
  activeTab,
  setActiveTab,
  isLiveActivity,
  setIsLiveActivity,
  handleQuickActions,
}) => (
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
);

export default AdvancedDashboardTab;
