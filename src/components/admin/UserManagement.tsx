
import React, { useState } from 'react';
import { EnhancedMembersList } from './EnhancedMembersList';
import { PendingInvitations } from './PendingInvitations';
import { useUserManagement } from '@/hooks/useUserManagement';
import { SimpleUserManagementHeader } from './SimpleUserManagementHeader';
import { MemberStats } from './MemberStats';
import { UserManagementTabs } from './UserManagementTabs';
import { EnhancedInviteUserModal } from './EnhancedInviteUserModal';
import { useRemoveUser, useCancelInvitation } from '@/hooks/useUserInvitation';

interface UserManagementProps {
  organizationId: string;
  organizationName: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  organizationId,
  organizationName
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  
  const {
    membersLoading,
    invitationsLoading,
    handleUpdateRole,
    activeMembers,
    pendingInvitations,
  } = useUserManagement(organizationId);

  const removeUserMutation = useRemoveUser();
  const cancelInvitationMutation = useCancelInvitation();

  const handleRemoveMember = (userId: string) => {
    removeUserMutation.mutate({ userId, organizationId });
  };

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitationMutation.mutate({ invitationId });
  };

  const adminsCount = activeMembers.filter(m => {
    const role = m.enhanced_role || m.role;
    return ['admin', 'owner'].includes(role);
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SimpleUserManagementHeader organizationName={organizationName} />
        <EnhancedInviteUserModal organizationId={organizationId} />
      </div>

      <MemberStats
        activeMembersCount={activeMembers.length}
        adminsCount={adminsCount}
        pendingInvitationsCount={pendingInvitations.length}
      />
      
      <UserManagementTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        membersCount={activeMembers.length}
        invitationsCount={pendingInvitations.length}
      />

      {activeTab === 'members' && (
        <EnhancedMembersList
          members={activeMembers}
          loading={membersLoading}
          organizationId={organizationId}
          onUpdateRole={handleUpdateRole}
          onRemoveMember={handleRemoveMember}
        />
      )}

      {activeTab === 'invitations' && (
        <PendingInvitations
          invitations={pendingInvitations}
          loading={invitationsLoading}
          onCancelInvitation={handleCancelInvitation}
        />
      )}
    </div>
  );
};
