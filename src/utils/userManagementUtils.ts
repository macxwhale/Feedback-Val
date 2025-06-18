
import { Shield, User, Settings, BarChart3, Eye, Crown } from 'lucide-react';

// Enhanced role support - this is now the primary and only system
export type EnhancedRole = 'owner' | 'admin' | 'manager' | 'analyst' | 'member' | 'viewer';

// Enhanced role configuration - primary and only configuration
export const ENHANCED_USER_ROLE_CONFIG = {
  owner: { variant: 'destructive' as const, icon: Crown, label: 'Owner' },
  admin: { variant: 'default' as const, icon: Shield, label: 'Admin' },
  manager: { variant: 'secondary' as const, icon: Settings, label: 'Manager' },
  analyst: { variant: 'outline' as const, icon: BarChart3, label: 'Analyst' },
  member: { variant: 'secondary' as const, icon: User, label: 'Member' },
  viewer: { variant: 'outline' as const, icon: Eye, label: 'Viewer' },
} as const;

export const getRoleBadge = (role: string) => {
  // Use enhanced role configuration
  const enhancedConfig = ENHANCED_USER_ROLE_CONFIG[role as EnhancedRole];
  if (enhancedConfig) {
    return {
      variant: enhancedConfig.variant,
      icon: enhancedConfig.icon,
      label: enhancedConfig.label,
    };
  }
  
  // Default fallback to member
  const config = ENHANCED_USER_ROLE_CONFIG.member;
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
