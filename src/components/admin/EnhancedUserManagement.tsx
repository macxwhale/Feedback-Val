
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Shield, AlertTriangle } from 'lucide-react';
import { SearchAndFilters } from './dashboard/SearchAndFilters';
import { PaginationControls } from './dashboard/PaginationControls';
import { EnhancedLoadingSpinner } from './dashboard/EnhancedLoadingSpinner';
import { usePaginatedUsers } from '@/hooks/usePaginatedUsers';
import { useAuditLogging } from '@/hooks/useAuditLogging';
import { useToast } from '@/hooks/use-toast';

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced User Management</h2>
          <p className="text-gray-600">Manage members for {organizationName}</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{totalCount}</div>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.status === 'pending').length}
                </div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilter}
        onClear={handleClearFilters}
      />

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <EnhancedLoadingSpinner text="Loading users..." />
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || roleFilter ? 'No users match your filters' : 'No users found'}
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {users.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              hasMore={hasMore}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
