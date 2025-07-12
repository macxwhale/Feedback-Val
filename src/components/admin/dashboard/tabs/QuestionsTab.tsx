
import React from "react";
import { PermissionGuard } from '@/components/auth/PermissionGuard';

interface QuestionsTabProps {
  organization: any;
}

const QuestionsManagement: React.FC<{ organizationId: string }> = ({ organizationId }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Questions Management</h2>
      <p className="text-gray-600">Manage your organization's questions here.</p>
      <p className="text-sm text-gray-500 mt-2">Organization ID: {organizationId}</p>
    </div>
  );
};

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
