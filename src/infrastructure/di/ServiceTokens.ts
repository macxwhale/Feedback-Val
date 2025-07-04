
/**
 * Service Tokens for Dependency Injection
 * Provides type-safe tokens for service registration and resolution
 */

export const SERVICE_TOKENS = {
  // Core Services
  USER_SERVICE: Symbol('UserService'),
  ORGANIZATION_SERVICE: Symbol('OrganizationService'),
  INVITATION_SERVICE: Symbol('InvitationService'),
  
  // Analytics Services
  ANALYTICS_SERVICE: Symbol('AnalyticsService'),
  PERFORMANCE_SERVICE: Symbol('PerformanceService'),
  METRICS_SERVICE: Symbol('MetricsService'),
  
  // Infrastructure Services
  LOGGER_SERVICE: Symbol('LoggerService'),
  CACHE_SERVICE: Symbol('CacheService'),
  NOTIFICATION_SERVICE: Symbol('NotificationService'),
  
  // External Services
  SMS_SERVICE: Symbol('SmsService'),
  EMAIL_SERVICE: Symbol('EmailService'),
  STORAGE_SERVICE: Symbol('StorageService'),
} as const;

export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS];
