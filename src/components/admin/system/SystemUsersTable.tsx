
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { SystemUser } from '@/hooks/useSystemUsers';

interface SystemUsersTableProps {
  users: SystemUser[];
}

export const SystemUsersTable: React.FC<SystemUsersTableProps> = ({ users }) => {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>
              <Link to={`/admin/${user.organizations.slug}`} className="text-blue-600 hover:underline">
                {user.organizations.name}
              </Link>
            </TableCell>
            <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
            <TableCell><Badge variant={user.status === 'active' ? 'default' : 'outline'}>{user.status}</Badge></TableCell>
            <TableCell>{format(new Date(user.created_at), 'PPP')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
