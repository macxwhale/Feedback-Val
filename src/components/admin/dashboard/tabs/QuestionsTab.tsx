
import React from "react";
import { QuestionsManagement } from '../../QuestionsManagement';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { useOrganization } from '@/context/OrganizationContext';

export const QuestionsTab: React.FC = () => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Organization not found</p>
      </div>
    );
  }

  return (
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
      <QuestionsManagement />
    </PermissionGuard>
  );
};

export default QuestionsTab;
