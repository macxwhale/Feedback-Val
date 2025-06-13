
import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { LiveActivityFeed } from './LiveActivityFeed';
import { AnalyticsInsights } from './AnalyticsInsights';
import { QuickActions } from './QuickActions';
import { FeedbackTrendsChart } from './charts/FeedbackTrendsChart';
import { ResponseDistributionChart } from './charts/ResponseDistributionChart';
import { DataExportDialog } from './DataExportDialog';
import { DashboardCustomization } from './DashboardCustomization';
import { NotificationCenter } from './NotificationCenter';
import { MobileDashboard } from './MobileDashboard';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface AdvancedDashboardViewProps {
  organizationId: string;
  organizationName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
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

export const AdvancedDashboardView: React.FC<AdvancedDashboardViewProps> = ({
  organizationId,
  organizationName,
  activeTab,
  onTabChange,
  stats,
  isLiveActivity,
  setIsLiveActivity,
  handleQuickActions
}) => {
  const { isMobile } = useMobileDetection();

  // Show mobile dashboard for mobile devices
  if (isMobile) {
    return (
      <MobileDashboard
        organizationName={organizationName}
        stats={stats}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />
    );
  }

  // Desktop dashboard layout
  return (
    <div className="space-y-6">
      {/* Header with customization options */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center space-x-3">
          <DataExportDialog organizationId={organizationId} />
          <DashboardCustomization />
          <NotificationCenter />
        </div>
      </div>

      {/* Main stats overview */}
      <DashboardOverview organizationId={organizationId} />
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackTrendsChart />
        <ResponseDistributionChart />
      </div>

      {/* Activity and insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveActivityFeed 
            organizationId={organizationId}
            isLive={isLiveActivity}
            onToggleLive={setIsLiveActivity}
          />
        </div>
        <div className="space-y-6">
          <AnalyticsInsights organizationId={organizationId} />
          <QuickActions {...handleQuickActions} />
        </div>
      </div>
    </div>
  );
};
