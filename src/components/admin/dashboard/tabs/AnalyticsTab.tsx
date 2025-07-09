
import React from 'react';
import { AnalyticsDashboard } from '../AnalyticsDashboard';

interface AnalyticsTabProps {
  organizationId: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ organizationId }) => {
  return <AnalyticsDashboard organizationId={organizationId} />;
};
