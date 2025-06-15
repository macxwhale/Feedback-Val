
import React from "react";
import { PerformanceAnalyticsDashboard } from '../PerformanceAnalyticsDashboard';

interface PerformanceTabProps {
  organizationId: string;
}
export const PerformanceTab: React.FC<PerformanceTabProps> = ({ organizationId }) =>
  <PerformanceAnalyticsDashboard organizationId={organizationId} />;

export default PerformanceTab;
