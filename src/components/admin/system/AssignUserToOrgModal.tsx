
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SystemUser } from '@/hooks/useSystemUsers';
import { Organization } from '@/services/organizationService.types';

interface AssignUserToOrgModalProps {
  user: SystemUser | null;
  organizations: Organization[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, email: string, organizationId: string, role: string) => void;
  isSubmitting: boolean;
}

export const AssignUserToOrgModal: React.FC<AssignUserToOrgModalProps> = ({ user, organizations, isOpen, onClose, onSubmit, isSubmitting }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('member');

  const handleSubmit = () => {
    if (user && selectedOrgId) {
      onSubmit(user.user_id, user.email, selectedOrgId, selectedRole);
    }
  };
  
  if (!isOpen || !user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign User to Organization</DialogTitle>
          <DialogDescription>
            Assign <strong>{user.email}</strong> to a new organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Select onValueChange={setSelectedOrgId} value={selectedOrgId}>
              <SelectTrigger id="organization">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedOrgId || isSubmitting}>
            {isSubmitting ? 'Assigning...' : 'Assign User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
