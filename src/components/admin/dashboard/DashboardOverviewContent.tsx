
import React from 'react';
import { H1, Body } from '@/components/ui/typography';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { DashboardCharts } from './DashboardCharts';
import { DashboardQuickActions } from './DashboardQuickActions';
import { useDashboardData } from './DashboardDataProvider';

interface DashboardOverviewContentProps {
  onTabChange: (tab: string) => void;
}

export const DashboardOverviewContent: React.FC<DashboardOverviewContentProps> = ({ onTabChange }) => {
  const { organization } = useDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <H1 className="mb-2">Analytics Dashboard</H1>
        <Body>Here's what's happening with {organization?.name} today.</Body>
      </div>
      
      <DashboardStatsGrid />
      <DashboardCharts />
      <DashboardQuickActions onTabChange={onTabChange} />
    </div>
  );
};
