
import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsTable } from './AnalyticsTable';
import { AnalyticsInsights } from './AnalyticsInsights';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { RefactoredExecutiveDashboard } from './RefactoredExecutiveDashboard';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { useEnhancedOrganizationStats } from '@/hooks/useEnhancedOrganizationStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

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
  stats,
  handleQuickActions
}) => {
  const { data: analyticsData, isLoading } = useAnalyticsTableData(organizationId);
  const { data: enhancedStats } = useEnhancedOrganizationStats(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Enhance the summary data with avg_session_score from enhancedStats
  const enhancedSummary = analyticsData?.summary ? {
    ...analyticsData.summary,
    overall_avg_score: enhancedStats?.avg_session_score || 0
  } : undefined;

  return (
    <div className="space-y-6">
      {/* Core Analytics Overview (contains the proper stat cards) */}
      <DashboardOverview organizationId={organizationId} />

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="executive" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Executive</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Real-Time</span>
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Detailed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsData && enhancedSummary && (
              <>
                <AnalyticsTable
                  questions={analyticsData.questions}
                  categories={analyticsData.categories}
                  summary={enhancedSummary}
                />
                <AnalyticsInsights 
                  stats={enhancedStats}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="executive">
          <RefactoredExecutiveDashboard organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeAnalytics organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="detailed">
          {analyticsData && enhancedSummary && (
            <AnalyticsTable
              questions={analyticsData.questions}
              categories={analyticsData.categories}
              summary={enhancedSummary}
              showDrillDown={true}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
