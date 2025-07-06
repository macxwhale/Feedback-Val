
import React, { Suspense } from 'react';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { DashboardDataProvider } from './DashboardDataProvider';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';

// Lazy load heavy components
const DashboardCharts = React.lazy(() => 
  import('./DashboardCharts').then(module => ({ default: module.DashboardCharts }))
);

const CustomerInsightsDashboard = React.lazy(() => 
  import('./CustomerInsightsDashboard').then(module => ({ default: module.CustomerInsightsDashboard }))
);

interface OptimizedDashboardProps {
  organizationId: string;
  activeView?: 'overview' | 'charts' | 'insights';
}

export const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({
  organizationId,
  activeView = 'overview'
}) => {
  const { isMobile, isTablet } = useResponsiveDesign();

  const renderView = () => {
    switch (activeView) {
      case 'charts':
        return (
          <Suspense fallback={<EnhancedLoading variant="skeleton" text="Loading charts..." />}>
            <DashboardCharts />
          </Suspense>
        );
      case 'insights':
        return (
          <Suspense fallback={<EnhancedLoading variant="skeleton" text="Loading insights..." />}>
            <CustomerInsightsDashboard organizationId={organizationId} />
          </Suspense>
        );
      default:
        return (
          <div className="space-y-6">
            <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
              <DashboardCharts />
            </Suspense>
          </div>
        );
    }
  };

  return (
    <DashboardDataProvider>
      <ResponsiveContainer
        maxWidth="full"
        padding={isMobile ? 'sm' : 'lg'}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100"
      >
        {renderView()}
      </ResponsiveContainer>
    </DashboardDataProvider>
  );
};
