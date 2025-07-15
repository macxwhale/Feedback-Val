
import { supabase } from '@/integrations/supabase/client';
import { hasPermission, canManageRole, type Role } from '@/utils/roleManagement';

export interface RBACContext {
  userId: string;
  organizationId: string;
  userRole?: Role;
  isAdmin?: boolean;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: Role;
}

export class RBACService {
  private static roleCache = new Map<string, { role: Role; timestamp: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000;

  static async getUserRole(userId: string, organizationId: string): Promise<Role | null> {
    const cacheKey = `${userId}-${organizationId}`;
    const cached = this.roleCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.role;
    }

    try {
      const { data, error } = await supabase
        .from('organization_users')
        .select('enhanced_role, role')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .single();

      if (error || !data) return null;

      // Prioritize enhanced_role, fallback to legacy role mapping
      let role: Role;
      if (data.enhanced_role && ['owner', 'admin', 'manager', 'analyst', 'member', 'viewer'].includes(data.enhanced_role)) {
        role = data.enhanced_role as Role;
      } else if (data.role === 'admin') {
        role = 'admin';
      } else {
        role = 'member';
      }

      this.roleCache.set(cacheKey, { role, timestamp: Date.now() });
      return role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  static async checkPermission(
    context: RBACContext,
    permission: string,
    targetUserId?: string
  ): Promise<PermissionResult> {
    if (context.isAdmin) {
      return { allowed: true, reason: 'System admin access' };
    }

    let userRole = context.userRole;
    if (!userRole) {
      userRole = await this.getUserRole(context.userId, context.organizationId);
      if (!userRole) {
        return { allowed: false, reason: 'User role not found' };
      }
    }

    const hasBasicPermission = hasPermission(userRole, permission);
    if (!hasBasicPermission) {
      return { 
        allowed: false, 
        reason: `Role '${userRole}' lacks permission '${permission}'`,
        requiredRole: this.getMinimumRoleForPermission(permission)
      };
    }

    if (permission === 'manage_users' && targetUserId) {
      const targetRole = await this.getUserRole(targetUserId, context.organizationId);
      if (targetRole && !canManageRole(userRole, targetRole)) {
        return { 
          allowed: false, 
          reason: `Cannot manage user with role '${targetRole}'`,
          requiredRole: targetRole
        };
      }
    }

    return { allowed: true };
  }

  static async requirePermission(
    context: RBACContext,
    permission: string,
    targetUserId?: string
  ): Promise<void> {
    const result = await this.checkPermission(context, permission, targetUserId);
    if (!result.allowed) {
      throw new RBACError(result.reason || 'Access denied', result.requiredRole);
    }
  }

  private static getMinimumRoleForPermission(permission: string): Role {
    const permissionRoleMap: Record<string, Role> = {
      'view_analytics': 'viewer',
      'export_data': 'analyst',
      'manage_questions': 'analyst',
      'manage_users': 'manager',
      'manage_integrations': 'admin',
      'manage_organization': 'admin',
      'manage_billing': 'owner'
    };
    return permissionRoleMap[permission] || 'admin';
  }

  static clearCache(userId?: string, organizationId?: string): void {
    if (userId && organizationId) {
      this.roleCache.delete(`${userId}-${organizationId}`);
    } else {
      this.roleCache.clear();
    }
  }
}

export class RBACError extends Error {
  constructor(message: string, public requiredRole?: Role) {
    super(message);
    this.name = 'RBACError';
  }
}
