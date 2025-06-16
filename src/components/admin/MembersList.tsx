
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, User, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RoleBadge } from './RoleBadge';
import { UserAvatar } from './UserAvatar';
import { formatDate, getStatusBadgeVariant } from '@/utils/userManagementUtils';

interface Member {
  id: string;
  user_id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  accepted_at: string;
  invited_by?: { email: string };
}

interface MembersListProps {
  members: Member[];
  loading: boolean;
  onUpdateRole: (userId: string, newRole: string) => void;
  onRemoveMember: (userId: string) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  loading,
  onUpdateRole,
  onRemoveMember
}) => {
  const handleRoleToggle = (member: Member) => {
    const newRole = member.role === 'admin' ? 'member' : 'admin';
    onUpdateRole(member.user_id, newRole);
  };

  const getRoleToggleLabel = (role: string) => {
    return role === 'admin' ? 'Remove Admin' : 'Make Admin';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading members...</div>
        </CardContent>
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>No members found</p>
            <p className="text-sm">Invite users to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <UserAvatar email={member.email} />
                    <div>
                      <div className="font-medium">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={member.role} />
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.accepted_at 
                    ? formatDate(member.accepted_at)
                    : formatDate(member.created_at)
                  }
                </TableCell>
                <TableCell>
                  {member.invited_by?.email || '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleToggle(member)}>
                        {getRoleToggleLabel(member.role)}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600"
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
                              Are you sure you want to remove {member.email} from this organization? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onRemoveMember(member.user_id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
