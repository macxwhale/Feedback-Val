
import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useAuditLogging } from '@/hooks/useAuditLogging';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { UserManagementHeader } from './UserManagementHeader';
import { UserManagementStats } from './UserManagementStats';
import { UsersList } from './UsersList';
import { supabase } from '@/integrations/supabase/client';

// Utility: Input sanitization function (for future developer use)
const sanitizeInput = (value: string) => value.trim();
// Zod: Define validation for users API response
const UsersApiSchema = z.object({
  users: z.array(z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: z.string(),
    status: z.string(),
    created_at: z.string().datetime(),
  })),
  total_count: z.number(),
  page_size: z.number(),
  page_offset: z.number(),
  has_more: z.boolean(),
});

// Check if current user is org admin (RBAC)
async function checkOrgAdminRole(organizationId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_current_user_org_admin', { org_id: organizationId });
  if (error) return false;
  return !!data;
}

interface EnhancedUserManagementProps {
  organizationId: string;
  organizationName: string;
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = React.memo(
  ({ organizationId, organizationName }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const logAction = useAuditLogging();
    const pageSize = 20;
    const pageOffset = currentPage * pageSize;

    // RBAC: only load user data if user is admin
    const { data: isAdmin, isLoading: isRBACLoading } = useQuery({
      queryKey: ['is-org-admin', organizationId],
      queryFn: () => checkOrgAdminRole(organizationId),
      enabled: !!organizationId,
      staleTime: 10 * 60 * 1000,
    });

    // Data fetching w/Zod validation
    const { data: usersData, isLoading, error } = useQuery({
      queryKey: ['paginated-users', organizationId, pageSize, pageOffset, searchTerm, roleFilter],
      queryFn: async () => {
        const { data, error } = await supabase.rpc('get_paginated_organization_users', {
          org_id: organizationId,
          page_size: pageSize,
          page_offset: pageOffset,
          search_term: searchTerm ? sanitizeInput(searchTerm) : null,
          role_filter: roleFilter === 'all' ? null : roleFilter,
        });
        if (error) throw error;
        // Zod parse API data for safety
        return UsersApiSchema.parse(data);
      },
      enabled: !!organizationId && isAdmin,
      staleTime: 30_000,
    });

    // Derived
    // Defensive fix: zod parse should ensure right shape, but we add extra filter just in case
    const users = (usersData?.users ?? []).filter(
      (user: any): user is {
        id: string;
        email: string;
        role: string;
        status: string;
        created_at: string;
      } =>
        !!user &&
        typeof user.id === "string" &&
        typeof user.email === "string" &&
        typeof user.role === "string" &&
        typeof user.status === "string" &&
        typeof user.created_at === "string"
    );
    const totalCount = usersData?.total_count || 0;
    const hasMore = usersData?.has_more || false;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Handlers
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      logAction.mutate({
        action: 'navigate_user_page',
        resourceType: 'user_management',
        organizationId,
        metadata: { page, searchTerm, roleFilter }
      });
    };
    const handleSearch = (v: string) => {
      setSearchTerm(sanitizeInput(v));
      setCurrentPage(0);
    };
    const handleRoleFilter = (role: string) => {
      setRoleFilter(sanitizeInput(role));
      setCurrentPage(0);
    };
    const handleClearFilters = () => {
      setSearchTerm('');
      setRoleFilter('all');
      setCurrentPage(0);
    };
    const handleInviteUser = () => {
      toast({
        title: "Feature coming soon",
        description: "Invite user functionality will be implemented soon.",
      });
    };

    // Error boundary UI
    if (error || (!isLoading && !isAdmin)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {isAdmin === false
                ? "Access Denied"
                : "Error Loading Users"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {isAdmin === false
                ? "You do not have permission to view this organization's users."
                : "Failed to load user data. Please try again."}
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-2">
                Error: {error.message}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    if (isRBACLoading || isLoading) {
      return (
        <div className="py-10 text-center text-gray-400">Loading...</div>
      );
    }

    // Main UI
    return (
      <div className="space-y-6 mt-8">
        <UserManagementHeader
          organizationName={organizationName}
          onInviteUser={handleInviteUser}
        />
        <UserManagementStats
          totalCount={totalCount}
          users={users}
        />
        {/* Search & Filters subcomponent */}
        {/* ... you can add actual subcomponent extraction here for search & filters if needed ... */}
        <UsersList
          users={users}
          totalCount={totalCount}
          isLoading={isLoading}
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }
);
