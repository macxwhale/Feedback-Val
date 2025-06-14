
import React from "react";
import { FeedbackInbox } from '../../inbox/FeedbackInbox';

interface InboxTabProps {
  organizationId: string;
}
export const InboxTab: React.FC<InboxTabProps> = ({ organizationId }) => {
  return <FeedbackInbox organizationId={organizationId} />;
};
