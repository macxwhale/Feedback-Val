
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DashboardOverview } from './DashboardOverview';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { AnalyticsTable } from './AnalyticsTable';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';

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

  return (
    <div className="space-y-8" data-testid="advanced-dash">
      {/* Main statistics/summary section */}
      <DashboardOverview organizationId={organizationId} />

      {/* Quick action buttons */}
      <QuickActions
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
              <RecentActivity organizationId={organizationId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {/* No AnalyticsCharts component found; you may implement charts here if needed or leave blank */}
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-4">Analytics Charts</h3>
              {/* Placeholder - implement chart visuals here if needed */}
              <div>No charts available.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <AnalyticsTable
            questions={analyticsData?.questions || []}
            categories={analyticsData?.categories || []}
            summary={analyticsData?.summary || {
              total_questions: 0,
              total_responses: 0,
              overall_avg_score: 0,
              overall_completion_rate: 0
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

