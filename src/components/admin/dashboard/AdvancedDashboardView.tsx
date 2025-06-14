import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsTable } from './AnalyticsTable';
import { AnalyticsInsights } from './AnalyticsInsights';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { RefactoredExecutiveDashboard } from './RefactoredExecutiveDashboard';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { useEnhancedOrganizationStats } from '@/hooks/useEnhancedOrganizationStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Clock, Target, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsTableData(organizationId);
  const { data: enhancedStats, isLoading: enhancedLoading, error: enhancedError } = useEnhancedOrganizationStats(organizationId);

  console.log('AdvancedDashboardView - Render state:', {
    organizationId,
    analyticsLoading,
    enhancedLoading,
    analyticsData: analyticsData ? 'loaded' : 'null',
    enhancedStats: enhancedStats ? 'loaded' : 'null',
    analyticsError,
    enhancedError
  });

  // Show loading state only if both are loading
  if (analyticsLoading && enhancedLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Create enhanced summary with fallback values
  const createEnhancedSummary = () => {
    const baseSummary = analyticsData?.summary || {
      total_questions: 0,
      total_responses: 0,
      overall_completion_rate: 0
    };
    
    return {
      ...baseSummary,
      overall_avg_score: enhancedStats?.avg_session_score || 0
    };
  };

  const enhancedSummary = createEnhancedSummary();

  return (
    <div className="space-y-6">
      {/* Show error alerts if any */}
      {(analyticsError || enhancedError) && (
        <Alert className="border-yellow-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some dashboard data may be unavailable. {analyticsError?.message || enhancedError?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Core Analytics Overview (contains the proper stat cards) */}
      <DashboardOverview organizationId={organizationId} />

      {/* Ensure that section labels and navigation are not duplicated here */}
      {/* The Tabs, TabsList, SectionLabel, and tab labels are handled ONLY in DashboardTabs.tsx */}

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
            <AnalyticsTable
              questions={analyticsData?.questions || []}
              categories={analyticsData?.categories || []}
              summary={enhancedSummary}
            />
            <AnalyticsInsights 
              stats={enhancedStats}
              isLoading={enhancedLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="executive">
          <RefactoredExecutiveDashboard organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeAnalytics organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="detailed">
          {/* Show detailed view even with partial data */}
          <AnalyticsTable
            questions={analyticsData?.questions || []}
            categories={analyticsData?.categories || []}
            summary={enhancedSummary}
            showDrillDown={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
