import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsTable } from './AnalyticsTable';
import { AnalyticsInsights } from './AnalyticsInsights';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { RefactoredExecutiveDashboard } from './RefactoredExecutiveDashboard';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { useEnhancedOrganizationStats } from '@/hooks/useEnhancedOrganizationStats';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// MAIN: No Tabs, only pure content switching!
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
  stats,
  isLiveActivity,
  setIsLiveActivity,
  handleQuickActions,
}) => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsTableData(organizationId);
  const { data: enhancedStats, isLoading: enhancedLoading, error: enhancedError } = useEnhancedOrganizationStats(organizationId);

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

  // Alerts
  const errorAlert = (analyticsError || enhancedError) ? (
    <Alert className="border-yellow-500 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Some dashboard data may be unavailable. {analyticsError?.message || enhancedError?.message}
      </AlertDescription>
    </Alert>
  ) : null;

  // Master switch: what content to show for each subview (from parent)
  if (activeTab === "overview") {
    return (
      <div className="space-y-6">
        {errorAlert}
        <DashboardOverview organizationId={organizationId} />
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
      </div>
    );
  }
  if (activeTab === "executive") {
    return (
      <div className="space-y-6">
        {errorAlert}
        <RefactoredExecutiveDashboard organizationId={organizationId} />
      </div>
    );
  }
  if (activeTab === "realtime") {
    return (
      <div className="space-y-6">
        {errorAlert}
        <RealTimeAnalytics organizationId={organizationId} />
      </div>
    );
  }
  if (activeTab === "detailed") {
    return (
      <div className="space-y-6">
        {errorAlert}
        <AnalyticsTable
          questions={analyticsData?.questions || []}
          categories={analyticsData?.categories || []}
          summary={enhancedSummary}
          showDrillDown={true}
        />
      </div>
    );
  }

  // Default fallback: allow parent to handle
  return (
    <>
      {errorAlert}
      <DashboardOverview organizationId={organizationId} />
    </>
  );
};
