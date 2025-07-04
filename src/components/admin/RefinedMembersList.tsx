
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Trash2, Mail, Crown, Shield } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { EnhancedRoleBadge } from './EnhancedRoleBadge';
import { EnhancedRoleSelector } from './EnhancedRoleSelector';
import { UserAvatar } from './UserAvatar';
import { formatDate, getStatusBadgeVariant } from '@/utils/userManagementUtils';
import { useEnhancedPermissions } from '@/hooks/useEnhancedPermissions';
import { canManageRole } from '@/utils/enhancedRoleUtils';
import { Badge } from '@/components/ui/badge';
import { 
  DashboardCard, 
  MetricLabel, 
  StatusDot 
} from '@/components/ui/refined-design-system';

interface Member {
  id: string;
  user_id: string;
  email: string;
  role?: string;
  enhanced_role?: string;
  status: string;
  created_at: string;
  accepted_at?: string;
  invited_by?: { email: string } | null;
}

interface RefinedMembersListProps {
  members: Member[];
  loading: boolean;
  organizationId: string;
  onUpdateRole: (userId: string, newRole: string) => void;
  onRemoveMember: (userId: string) => void;
}

export const RefinedMembersList: React.FC<RefinedMembersListProps> = ({
  members,
  loading,
  organizationId,
  onUpdateRole,
  onRemoveMember
}) => {
  const { userRole, canManageUsers } = useEnhancedPermissions(organizationId);

  const handleRoleChange = (member: Member, newRole: string) => {
    onUpdateRole(member.user_id, newRole);
  };

  const canEditMember = (member: Member) => {
    if (!canManageUsers()) return false;
    if (!userRole) return false;
    
    const memberRole = member.enhanced_role || member.role || 'member';
    return canManageRole(userRole, memberRole);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'admin':
        return Shield;
      default:
        return User;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'neutral';
    }
  };

  if (loading) {
    return (
      <DashboardCard>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading members...</p>
        </div>
      </DashboardCard>
    );
  }

  if (!members || members.length === 0) {
    return (
      <DashboardCard>
        <div className="text-center py-12">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">No members found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Invite users to get started with your organization
          </p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 dark:border-gray-800">
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">Member</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">Role</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">Joined</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">Invited By</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const memberRole = member.enhanced_role || member.role || 'member';
              const canEdit = canEditMember(member);
              const RoleIcon = getRoleIcon(memberRole);
              
              return (
                <TableRow 
                  key={member.id}
                  className="border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <UserAvatar email={member.email} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <MetricLabel className="mb-0">{member.email}</MetricLabel>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="w-4 h-4 text-gray-500" />
                      {canEdit ? (
                        <EnhancedRoleSelector
                          currentUserRole={userRole || 'member'}
                          selectedRole={memberRole}
                          onRoleChange={(newRole) => handleRoleChange(member, newRole)}
                        />
                      ) : (
                        <EnhancedRoleBadge role={memberRole} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <StatusDot variant={getStatusColor(member.status) as any} />
                      <Badge 
                        variant={getStatusBadgeVariant(member.status)}
                        className="text-xs font-medium"
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {member.accepted_at 
                        ? formatDate(member.accepted_at)
                        : formatDate(member.created_at)
                      }
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {member.invited_by?.email || '—'}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Member
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove <strong>{member.email}</strong> from this organization? 
                                  This action cannot be undone and they will lose access to all organizational resources.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onRemoveMember(member.user_id)}
                                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                >
                                  Remove Member
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  );
};
