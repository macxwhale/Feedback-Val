import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DashboardOverview } from './DashboardOverview';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { AnalyticsTable } from './AnalyticsTable';
import { AnalyticsCharts } from './AnalyticsCharts';
import { QuickActionButtons } from './QuickActionButtons';
import { RecentActivityList } from './RecentActivityList';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useAnalyticsSummary } from '@/hooks/useAnalyticsSummary';

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
  const [activeView, setActiveView] = useState('overview');
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsTableData(organizationId);
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(organizationId);
  const { data: summaryData } = useAnalyticsSummary(organizationId);

  return (
    <div className="space-y-8" data-testid="advanced-dash">
      {/* Main statistics/summary section */}
      <DashboardOverview organizationId={organizationId} />

      {/* Remove the repeated AnalyticsSummaryCards section */}
      {/* <AnalyticsSummaryCards summary={summaryData} /> */}

      {/* Quick action buttons */}
      <QuickActionButtons
        onCreateQuestion={handleQuickActions.onCreateQuestion}
        onInviteUser={handleQuickActions.onInviteUser}
        onExportData={handleQuickActions.onExportData}
        onViewSettings={handleQuickActions.onViewSettings}
      />

      {/* Real-time analytics toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="live-activity"
          checked={isLiveActivity}
          onCheckedChange={setIsLiveActivity}
        />
        <Label htmlFor="live-activity">Real-time activity</Label>
      </div>

      {/* Real-time analytics section */}
      {isLiveActivity && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Real-time Analytics</h3>
            <RealTimeAnalytics organizationId={organizationId} />
          </CardContent>
        </Card>
      )}

      {/* Analytics views */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <RecentActivityList 
                activities={recentActivity || []} 
                isLoading={activityLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Analytics Charts</h3>
              <AnalyticsCharts 
                data={analyticsData} 
                isLoading={analyticsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Detailed Analytics</h3>
              <AnalyticsTable 
                data={analyticsData} 
                isLoading={analyticsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
