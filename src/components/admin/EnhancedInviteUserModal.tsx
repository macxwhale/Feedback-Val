
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { useInviteUser } from '@/hooks/useUserInvitation';
import { EnhancedRoleSelector } from './EnhancedRoleSelector';
import { useEnhancedPermissions } from '@/hooks/useEnhancedPermissions';

interface EnhancedInviteUserModalProps {
  organizationId: string;
  trigger?: React.ReactNode;
}

interface FormState {
  email: string;
  role: string;
}

const INITIAL_FORM_STATE: FormState = {
  email: '',
  role: 'member',
};

export const EnhancedInviteUserModal: React.FC<EnhancedInviteUserModalProps> = ({ 
  organizationId, 
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const { userRole } = useEnhancedPermissions(organizationId);
  
  const inviteUserMutation = useInviteUser();

  const resetForm = () => {
    setFormState(INITIAL_FORM_STATE);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.email.trim()) {
      return;
    }

    inviteUserMutation.mutate(
      { 
        email: formState.email.trim(), 
        organizationId, 
        role: formState.role 
      },
      {
        onSuccess: () => {
          resetForm();
          setIsOpen(false);
        }
      }
    );
  };

  const updateFormField = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formState.email.trim().length > 0;

  const defaultTrigger = (
    <Button>
      <UserPlus className="w-4 h-4 mr-2" />
      Invite User
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User to Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formState.email}
              onChange={(e) => updateFormField('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <EnhancedRoleSelector
              currentUserRole={userRole || 'member'}
              selectedRole={formState.role}
              onRoleChange={(value) => updateFormField('role', value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={inviteUserMutation.isPending || !isFormValid}
            >
              {inviteUserMutation.isPending ? 'Inviting...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
