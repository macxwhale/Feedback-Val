
import React from "react";
import { CustomerInsightsDashboard } from '../CustomerInsightsDashboard';

interface CustomerInsightsTabProps {
  organizationId: string;
}
export const CustomerInsightsTab: React.FC<CustomerInsightsTabProps> = ({ organizationId }) =>
  <CustomerInsightsDashboard organizationId={organizationId} />;
