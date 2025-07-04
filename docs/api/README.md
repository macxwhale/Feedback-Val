
# API Documentation

This document provides comprehensive documentation for the application's API and service layer.

## Table of Contents

- [Service Architecture](#service-architecture)
- [Dependency Injection](#dependency-injection)
- [Core Services](#core-services)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Performance Monitoring](#performance-monitoring)

## Service Architecture

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────┐
│     Presentation Layer      │
│    (React Components)       │
├─────────────────────────────┤
│     Application Layer       │
│      (Hooks & Context)      │
├─────────────────────────────┤
│      Domain Layer           │
│   (Interfaces & Models)     │
├─────────────────────────────┤
│   Infrastructure Layer      │
│  (Services & Repositories)  │
└─────────────────────────────┘
```

## Dependency Injection

The application uses a custom dependency injection container for managing service dependencies.

### Basic Usage

```typescript
import { useAnalyticsService } from '@/hooks/useServices';

const MyComponent = () => {
  const analyticsService = useAnalyticsService();
  
  // Use the service
  const metrics = await analyticsService.getMetrics('org-id');
};
```

### Service Registration

```typescript
import { container, SERVICE_TOKENS } from '@/infrastructure/di';

// Register a singleton service
container.registerSingleton(
  SERVICE_TOKENS.ANALYTICS_SERVICE,
  () => new AnalyticsService()
);

// Register a transient service
container.register(
  SERVICE_TOKENS.LOGGER_SERVICE,
  () => new LoggerService()
);
```

## Core Services

### Analytics Service

Handles analytics data processing and reporting.

```typescript
interface IAnalyticsService {
  getMetrics(organizationId: string, filters?: AnalyticsFilters): Promise<AnalyticsMetrics>;
  getTrendData(organizationId: string, period: 'day' | 'week' | 'month'): Promise<TrendData[]>;
  getCategoryAnalytics(organizationId: string): Promise<CategoryAnalytics[]>;
  exportData(organizationId: string, format: 'csv' | 'json' | 'excel'): Promise<Blob>;
}
```

**Example Usage:**

```typescript
const analyticsService = useAnalyticsService();

// Get organization metrics
const metrics = await analyticsService.getMetrics('org-123');

// Get trend data for the last month
const trends = await analyticsService.getTrendData('org-123', 'month');

// Export data as CSV
const csvBlob = await analyticsService.exportData('org-123', 'csv');
```

### Performance Service

Provides comprehensive performance monitoring.

```typescript
interface IPerformanceService {
  getMetrics(): Promise<PerformanceMetrics>;
  getComponentPerformance(): Promise<ComponentPerformance[]>;
  getSystemPerformance(): Promise<SystemPerformance>;
  trackComponentRender(componentName: string, renderTime: number): void;
  clearMetrics(): void;
}
```

**Example Usage:**

```typescript
const performanceService = usePerformanceService();

// Track component render time
performanceService.trackComponentRender('MyComponent', 15.5);

// Get performance metrics
const metrics = await performanceService.getMetrics();

// Get component-specific performance data
const componentPerf = await performanceService.getComponentPerformance();
```

### Notification Service

Manages application notifications.

```typescript
interface INotificationService {
  getNotifications(filters?: NotificationFilters): Promise<NotificationMessage[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(organizationId?: string): Promise<void>;
  createNotification(notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>): Promise<NotificationMessage>;
  deleteNotification(notificationId: string): Promise<void>;
}
```

**Example Usage:**

```typescript
const notificationService = useNotificationService();

// Get unread notifications
const notifications = await notificationService.getNotifications({ read: false });

// Create a new notification
const notification = await notificationService.createNotification({
  title: 'New Feedback',
  message: 'You have received new feedback',
  type: 'info',
  organizationId: 'org-123'
});

// Mark notification as read
await notificationService.markAsRead(notification.id);
```

## Authentication

All services automatically handle authentication through the Supabase client. No additional authentication logic is required in service implementations.

## Error Handling

Services use a consistent error handling pattern:

```typescript
try {
  const result = await service.performOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw error; // Re-throw for component handling
}
```

## Performance Monitoring

The application includes built-in performance monitoring:

- Component render time tracking
- Memory usage monitoring
- Bundle size analysis
- Network performance metrics
- System resource usage

Access performance data through the `IPerformanceService` interface.
