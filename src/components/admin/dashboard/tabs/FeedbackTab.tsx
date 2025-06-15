
import React from "react";
import { OrganizationSpecificStats } from '../../OrganizationSpecificStats';

interface FeedbackTabProps {
  organizationId: string;
}
export const FeedbackTab: React.FC<FeedbackTabProps> = ({ organizationId }) =>
  <OrganizationSpecificStats organizationId={organizationId} />;

export default FeedbackTab;
