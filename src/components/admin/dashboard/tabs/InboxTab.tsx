
import React from "react";
import { FeedbackInbox } from '../../inbox/FeedbackInbox';

interface InboxTabProps {
  organizationId: string;
}
const InboxTab: React.FC<InboxTabProps> = ({ organizationId }) => {
  return <FeedbackInbox organizationId={organizationId} />;
};

export default InboxTab;
