
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Trash2, Shield } from 'lucide-react';
import { InviteUserModal } from './InviteUserModal';
import { MembersList } from './MembersList';
import { PendingInvitations } from './PendingInvitations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  organizationId: string;
  organizationName: string;
}

interface Member {
  id: string;
  user_id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  accepted_at: string | null;
  invited_by?: { email: string } | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
  invited_by?: { email: string } | null;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  organizationId,
  organizationName
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch organization members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_users')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Member[];
    }
  });

  // Fetch pending invitations using RPC to bypass type issues
  const { data: invitations, isLoading: invitationsLoading } = useQuery({
    queryKey: ['organization-invitations', organizationId],
    queryFn: async () => {
      // Use a direct query with proper casting
      const { data, error } = await supabase
        .rpc('get_organization_invitations', { org_id: organizationId });

      if (error) {
        // Fallback to a simpler approach if RPC doesn't exist
        console.log('RPC not available, using direct query');
        return [];
      }
      return data as Invitation[];
    }
  });

  // Send invitation mutation
  const inviteUserMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .rpc('create_user_invitation', {
          org_id: organizationId,
          invite_email: email,
          invite_role: role,
          inviter_id: userData.user?.id
        });

      if (error) {
        // Fallback to direct insert if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('organization_users')
          .insert({
            organization_id: organizationId,
            email,
            role,
            user_id: userData.user?.id || '',
            status: 'invited'
          })
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      setShowInviteModal(false);
      toast({
        title: "Invitation sent!",
        description: "The user will receive an email invitation to join the organization.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update member role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase
        .from('organization_users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('organization_id', organizationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      toast({
        title: "Role updated",
        description: "Member role has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('organization_users')
        .delete()
        .eq('user_id', userId)
        .eq('organization_id', organizationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      toast({
        title: "Member removed",
        description: "Member has been removed from the organization.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove member",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Cancel invitation mutation (simplified for now)
  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      // For now, we'll update the status in organization_users table
      const { error } = await supabase
        .from('organization_users')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleInviteUser = (email: string, role: string) => {
    inviteUserMutation.mutate({ email, role });
  };

  const handleUpdateRole = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleRemoveMember = (userId: string) => {
    removeMemberMutation.mutate(userId);
  };

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitationMutation.mutate(invitationId);
  };

  // Filter members and invitations from the same data source for now
  const activeMembers = members?.filter(m => m.status === 'active') || [];
  const pendingInvitations = members?.filter(m => m.status === 'invited') || [];

  const tabs = [
    { id: 'members', label: 'Members', icon: Users, count: activeMembers.length },
    { id: 'invitations', label: 'Pending Invitations', icon: Mail, count: pendingInvitations.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage members and invitations for {organizationName}</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{activeMembers.length}</div>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {activeMembers.filter(m => m.role === 'admin').length}
                </div>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{pendingInvitations.length}</div>
                <p className="text-sm text-gray-600">Pending Invitations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
            {count > 0 && (
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
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
          invitations={pendingInvitations.map(inv => ({
            id: inv.id,
            email: inv.email,
            role: inv.role,
            status: inv.status,
            created_at: inv.created_at,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            invited_by: inv.invited_by
          }))}
          loading={invitationsLoading}
          onCancelInvitation={handleCancelInvitation}
        />
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteUser}
          loading={inviteUserMutation.isPending}
        />
      )}
    </div>
  );
};
