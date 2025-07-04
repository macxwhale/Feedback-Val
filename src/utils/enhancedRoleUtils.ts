
import { Shield, User, Settings, BarChart3, Eye, Crown } from 'lucide-react';

export type EnhancedRole = 'owner' | 'admin' | 'manager' | 'analyst' | 'member' | 'viewer';

export interface RoleConfig {
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  level: number;
}

export const ENHANCED_ROLE_CONFIG: Record<EnhancedRole, RoleConfig> = {
  owner: {
    variant: 'destructive',
    icon: Crown,
    label: 'Owner',
    description: 'Full access including billing and organization management',
    level: 6
  },
  admin: {
    variant: 'default',
    icon: Shield,
    label: 'Admin',
    description: 'Full access except billing and ownership changes',
    level: 5
  },
  manager: {
    variant: 'secondary',
    icon: Settings,
    label: 'Manager',
    description: 'Team management and question creation',
    level: 4
  },
  analyst: {
    variant: 'outline',
    icon: BarChart3,
    label: 'Analyst',
    description: 'Analytics access and data export',
    level: 3
  },
  member: {
    variant: 'secondary',
    icon: User,
    label: 'Member',
    description: 'Basic access to view analytics',
    level: 2
  },
  viewer: {
    variant: 'outline',
    icon: Eye,
    label: 'Viewer',
    description: 'Read-only access to basic analytics',
    level: 1
  }
};

export const getEnhancedRoleBadge = (role: string) => {
  const config = ENHANCED_ROLE_CONFIG[role as EnhancedRole] || ENHANCED_ROLE_CONFIG.member;
  return {
    variant: config.variant,
    icon: config.icon,
    label: config.label,
    description: config.description,
    level: config.level
  };
};

export const canManageRole = (managerRole: string, targetRole: string): boolean => {
  const managerLevel = ENHANCED_ROLE_CONFIG[managerRole as EnhancedRole]?.level || 0;
  const targetLevel = ENHANCED_ROLE_CONFIG[targetRole as EnhancedRole]?.level || 0;
  return managerLevel > targetLevel;
};

export const getAvailableRolesForUser = (userRole: string): EnhancedRole[] => {
  const userLevel = ENHANCED_ROLE_CONFIG[userRole as EnhancedRole]?.level || 0;
  
  return Object.entries(ENHANCED_ROLE_CONFIG)
    .filter(([, config]) => config.level < userLevel)
    .map(([role]) => role as EnhancedRole);
};

export const hasPermission = (role: string, permission: string): boolean => {
  const roleLevel = ENHANCED_ROLE_CONFIG[role as EnhancedRole]?.level || 0;
  
  // Basic permission mapping based on role level
  const permissions: Record<string, number> = {
    'view_analytics': 1,
    'export_data': 3,
    'manage_questions': 3,
    'manage_users': 4,
    'manage_integrations': 5,
    'manage_organization': 5,
    'manage_billing': 6
  };
  
  const requiredLevel = permissions[permission] || 6;
  return roleLevel >= requiredLevel;
};
