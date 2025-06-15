
import React from "react";
import { SentimentAnalyticsDashboard } from '../SentimentAnalyticsDashboard';

interface SentimentTabProps {
  organizationId: string;
}
export const SentimentTab: React.FC<SentimentTabProps> = ({ organizationId }) =>
  <SentimentAnalyticsDashboard organizationId={organizationId} />;

export default SentimentTab;
