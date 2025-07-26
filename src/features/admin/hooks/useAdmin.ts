
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '../services/adminService';

export const useAdmin = () => {
  const statsQuery = useQuery({
    queryKey: ['admin-stats'],
    queryFn: AdminService.getSystemStats,
  });

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: AdminService.getUserList,
  });

  return {
    stats: statsQuery.data,
    users: usersQuery.data,
    isLoading: statsQuery.isLoading || usersQuery.isLoading,
    error: statsQuery.error || usersQuery.error,
  };
};
