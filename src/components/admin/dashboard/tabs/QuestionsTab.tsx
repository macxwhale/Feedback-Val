
import React from "react";
import { QuestionsManagement } from '@/components/admin/QuestionsManagement';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

interface QuestionsTabProps {
  organization: any;
}

export const QuestionsTab: React.FC<QuestionsTabProps> = ({ organization }) => (
  <PermissionGuard 
    permission="manage_questions" 
    organizationId={organization.id}
    showRequiredRole={true}
    fallback={
      <div className="text-center p-8">
        <p className="text-gray-500">You need analyst-level access or higher to manage questions.</p>
        <p className="text-sm text-gray-400 mt-2">
          Contact your organization administrator for access.
        </p>
      </div>
    }
  >
    <QuestionsManagement organizationId={organization.id} />
  </PermissionGuard>
);

export default QuestionsTab;
