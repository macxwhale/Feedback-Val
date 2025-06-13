
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SearchAndFilters } from './dashboard/SearchAndFilters';
import { usePaginatedUsers } from '@/hooks/usePaginatedUsers';
import { useAuditLogging } from '@/hooks/useAuditLogging';
import { useToast } from '@/hooks/use-toast';
import { UserManagementHeader } from './user-management/UserManagementHeader';
import { UserManagementStats } from './user-management/UserManagementStats';
import { UsersList } from './user-management/UsersList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface EnhancedUserManagementProps {
  organizationId: string;
  organizationName: string;
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  organizationId,
  organizationName
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logAction = useAuditLogging();

  const pageSize = 20;
  const pageOffset = currentPage * pageSize;

  const { 
    data: usersData, 
    isLoading, 
    error 
  } = usePaginatedUsers({
    organizationId,
    pageSize,
    pageOffset,
    searchTerm: searchTerm || undefined,
    roleFilter: roleFilter || undefined
  });

  const users = usersData?.users || [];
  const totalCount = usersData?.total_count || 0;
  const hasMore = usersData?.has_more || false;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Log page navigation
    logAction.mutate({
      action: 'navigate_user_page',
      resourceType: 'user_management',
      organizationId,
      metadata: { page, searchTerm, roleFilter }
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(0); // Reset to first page on filter
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setCurrentPage(0);
  };

  const handleInviteUser = () => {
    // TODO: Implement invite user functionality
    toast({
      title: "Feature coming soon",
      description: "Invite user functionality will be implemented soon.",
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Error Loading Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Failed to load user data. Please try again.
          </p>
          <p className="text-sm text-red-600 mt-2">
            Error: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <UserManagementHeader
        organizationName={organizationName}
        onInviteUser={handleInviteUser}
      />

      <UserManagementStats
        totalCount={totalCount}
        users={users}
      />

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilter}
        onClear={handleClearFilters}
      />

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
};
