
import { useQuery } from '@tanstack/react-query';

interface InvitationCacheStats {
  cacheSize: number;
  cacheHitRate: number;
  totalInvitations: number;
  lastClearTime?: number;
}

// Mock cache service for demonstration
class InvitationCacheService {
  private cache = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
  };

  getStats(): InvitationCacheStats {
    return {
      cacheSize: this.cache.size,
      cacheHitRate: this.stats.totalRequests > 0 
        ? (this.stats.hits / this.stats.totalRequests) * 100 
        : 0,
      totalInvitations: this.stats.totalRequests,
    };
  }

  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, totalRequests: 0 };
  }
}

const invitationCache = new InvitationCacheService();

export const useInvitationPerformanceStats = () => {
  return useQuery({
    queryKey: ['invitation-performance-stats'],
    queryFn: () => invitationCache.getStats(),
    refetchInterval: 5000, // Update every 5 seconds
  });
};

export { invitationCache };
