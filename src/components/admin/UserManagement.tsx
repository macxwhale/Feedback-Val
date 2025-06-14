
import React, { useState } from 'react';
import { MembersList } from './MembersList';
import { PendingInvitations } from './PendingInvitations';
import { useUserManagement } from '@/hooks/useUserManagement';
import { SimpleUserManagementHeader } from './SimpleUserManagementHeader';
import { MemberStats } from './MemberStats';
import { UserManagementTabs } from './UserManagementTabs';

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
    handleRemoveMember,
    handleCancelInvitation,
    activeMembers,
    pendingInvitations,
  } = useUserManagement(organizationId);

  const adminsCount = activeMembers.filter(m => m.role === 'admin').length;

  return (
    <div className="space-y-6">
      <SimpleUserManagementHeader organizationName={organizationName} />

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
        <MembersList
          members={activeMembers}
          loading={membersLoading}
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
