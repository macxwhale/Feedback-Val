
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { SystemInvitation } from '@/hooks/useSystemUsers';

interface SystemInvitationsTableProps {
  invitations: SystemInvitation[];
}

export const SystemInvitationsTable: React.FC<SystemInvitationsTableProps> = ({ invitations }) => {
  if (invitations.length === 0) {
    return <p className="text-sm text-gray-500">No pending invitations found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Invited At</TableHead>
          <TableHead>Expires At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="font-medium">{invitation.email}</TableCell>
            <TableCell>
               <Link to={`/admin/${invitation.organizations.slug}`} className="text-blue-600 hover:underline">
                {invitation.organizations.name}
              </Link>
            </TableCell>
            <TableCell><Badge variant="secondary">{invitation.role}</Badge></TableCell>
            <TableCell>{format(new Date(invitation.created_at), 'PPP')}</TableCell>
            <TableCell>{format(new Date(invitation.expires_at), 'PPP')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
