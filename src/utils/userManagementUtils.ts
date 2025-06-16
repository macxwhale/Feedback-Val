
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';

export interface UserRole {
  admin: 'default';
  member: 'secondary';
}

export const USER_ROLE_CONFIG = {
  admin: { variant: 'default' as const, icon: Shield, label: 'Admin' },
  member: { variant: 'secondary' as const, icon: User, label: 'Member' },
} as const;

export const getRoleBadge = (role: string) => {
  const config = USER_ROLE_CONFIG[role as keyof typeof USER_ROLE_CONFIG] || USER_ROLE_CONFIG.member;
  const Icon = config.icon;

  return {
    variant: config.variant,
    icon: Icon,
    label: config.label,
  };
};

export const getInitials = (email: string): string => {
  return email.split('@')[0].slice(0, 2).toUpperCase();
};

export const isExpiringSoon = (expiresAt: string): boolean => {
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilExpiry <= 24;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getStatusBadgeVariant = (status: string) => {
  return status === 'active' ? 'default' : 'secondary';
};
