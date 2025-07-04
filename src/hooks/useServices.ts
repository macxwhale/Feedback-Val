
/**
 * Service Access Hooks
 * Provides React hooks for accessing services through dependency injection
 */

import { useMemo } from 'react';
import { container } from '@/infrastructure/di/DIContainer';
import { SERVICE_TOKENS } from '@/infrastructure/di/ServiceTokens';

import type { IUserService } from '@/domain/interfaces/IUserService';
import type { IAnalyticsService } from '@/domain/interfaces/IAnalyticsService';
import type { IPerformanceService } from '@/domain/interfaces/IPerformanceService';
import type { INotificationService } from '@/domain/interfaces/INotificationService';
import type { IUserInvitationService } from '@/domain/interfaces/IUserInvitationService';

export const useUserService = (): IUserService => {
  return useMemo(() => container.resolve<IUserService>(SERVICE_TOKENS.USER_SERVICE), []);
};

export const useAnalyticsService = (): IAnalyticsService => {
  return useMemo(() => container.resolve<IAnalyticsService>(SERVICE_TOKENS.ANALYTICS_SERVICE), []);
};

export const usePerformanceService = (): IPerformanceService => {
  return useMemo(() => container.resolve<IPerformanceService>(SERVICE_TOKENS.PERFORMANCE_SERVICE), []);
};

export const useNotificationService = (): INotificationService => {
  return useMemo(() => container.resolve<INotificationService>(SERVICE_TOKENS.NOTIFICATION_SERVICE), []);
};

export const useInvitationService = (): IUserInvitationService => {
  return useMemo(() => container.resolve<IUserInvitationService>(SERVICE_TOKENS.INVITATION_SERVICE), []);
};

// Generic hook for accessing any service
export const useService = <T>(token: string | symbol): T => {
  return useMemo(() => container.resolve<T>(token), [token]);
};
