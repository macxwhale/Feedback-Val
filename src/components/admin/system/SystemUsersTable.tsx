import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { SystemUser } from '@/hooks/useSystemUsers';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface SystemUsersTableProps {
  users: SystemUser[];
  onAssignUser: (user: SystemUser) => void;
}

export const SystemUsersTable: React.FC<SystemUsersTableProps> = ({ users, onAssignUser }) => {
  if (users.length === 0) {
    return <p className="text-sm text-gray-500">No users found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          // gracefully handle missing organizations (e.g., for unassigned users)
          const hasOrg = user.organizations && user.organizations.name && user.organizations.slug;
          return (
            <TableRow key={user.id || user.user_id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                {hasOrg ? (
                  <Link to={`/admin/${user.organizations.slug}`} className="text-blue-600 hover:underline">
                    {user.organizations.name}
                  </Link>
                ) : (
                  <span className="text-gray-400 italic">—</span>
                )}
              </TableCell>
              <TableCell>
                {user.role ? <Badge variant="secondary">{user.role}</Badge>
                : <span className="text-gray-400 italic">—</span>}
              </TableCell>
              <TableCell>
                {user.status ? <Badge variant={user.status === 'active' ? 'default' : 'outline'}>{user.status}</Badge>
                : <span className="text-gray-400 italic">—</span>}
              </TableCell>
              <TableCell>
                {user.organization_user_created_at ? (
                  format(new Date(user.organization_user_created_at), 'PPP')
                ) : (
                  <span className="text-gray-400 italic">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onAssignUser(user)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign to Org
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
