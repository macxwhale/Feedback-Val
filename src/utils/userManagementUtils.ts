
import { Shield, User, Settings, BarChart3, Eye, Crown } from 'lucide-react';

// Enhanced role support - this is now the primary system
export type EnhancedRole = 'owner' | 'admin' | 'manager' | 'analyst' | 'member' | 'viewer';

// Enhanced role configuration - primary configuration
export const ENHANCED_USER_ROLE_CONFIG = {
  owner: { variant: 'destructive' as const, icon: Crown, label: 'Owner' },
  admin: { variant: 'default' as const, icon: Shield, label: 'Admin' },
  manager: { variant: 'secondary' as const, icon: Settings, label: 'Manager' },
  analyst: { variant: 'outline' as const, icon: BarChart3, label: 'Analyst' },
  member: { variant: 'secondary' as const, icon: User, label: 'Member' },
  viewer: { variant: 'outline' as const, icon: Eye, label: 'Viewer' },
} as const;

// Legacy support for backward compatibility - kept minimal
export const USER_ROLE_CONFIG = {
  admin: { variant: 'default' as const, icon: Shield, label: 'Admin' },
  member: { variant: 'secondary' as const, icon: User, label: 'Member' },
} as const;

export const getRoleBadge = (role: string) => {
  // Check if it's an enhanced role first (primary system)
  const enhancedConfig = ENHANCED_USER_ROLE_CONFIG[role as EnhancedRole];
  if (enhancedConfig) {
    return {
      variant: enhancedConfig.variant,
      icon: enhancedConfig.icon,
      label: enhancedConfig.label,
    };
  }
  
  // Fallback to legacy config for backward compatibility
  const config = USER_ROLE_CONFIG[role as keyof typeof USER_ROLE_CONFIG] || USER_ROLE_CONFIG.member;
  return {
    variant: config.variant,
    icon: config.icon,
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
