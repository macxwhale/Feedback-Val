
/**
 * Service Registry
 * Bootstraps and registers all application services
 */

import { container } from './DIContainer';
import { SERVICE_TOKENS } from './ServiceTokens';

// Service implementations
import { UserService } from '@/services/UserService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { EnhancedPerformanceService } from '@/services/EnhancedPerformanceService';
import { NotificationService } from '@/services/NotificationService';
import { UserInvitationService } from '@/services/userInvitationService';

// Interface imports
import type { IUserService } from '@/domain/interfaces/IUserService';
import type { IAnalyticsService } from '@/domain/interfaces/IAnalyticsService';
import type { IPerformanceService } from '@/domain/interfaces/IPerformanceService';
import type { INotificationService } from '@/domain/interfaces/INotificationService';
import type { IUserInvitationService } from '@/domain/interfaces/IUserInvitationService';

export class ServiceRegistry {
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    // Register core services as singletons
    container.registerSingleton<IUserService>(
      SERVICE_TOKENS.USER_SERVICE,
      () => new UserService()
    );

    container.registerSingleton<IAnalyticsService>(
      SERVICE_TOKENS.ANALYTICS_SERVICE,
      () => new AnalyticsService()
    );

    container.registerSingleton<IPerformanceService>(
      SERVICE_TOKENS.PERFORMANCE_SERVICE,
      () => new EnhancedPerformanceService()
    );

    container.registerSingleton<INotificationService>(
      SERVICE_TOKENS.NOTIFICATION_SERVICE,
      () => new NotificationService()
    );

    container.registerSingleton<IUserInvitationService>(
      SERVICE_TOKENS.INVITATION_SERVICE,
      () => new UserInvitationService()
    );

    this.initialized = true;
  }

  public static reset(): void {
    container.clear();
    this.initialized = false;
  }
}

// Auto-initialize services
ServiceRegistry.initialize();
