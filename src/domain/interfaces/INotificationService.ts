
/**
 * Notification Service Interface
 * Defines the contract for notification operations
 */

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  organizationId?: string;
  userId?: string;
}

export interface NotificationFilters {
  type?: NotificationMessage['type'];
  read?: boolean;
  organizationId?: string;
  userId?: string;
}

export interface INotificationService {
  getNotifications(filters?: NotificationFilters): Promise<NotificationMessage[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(organizationId?: string): Promise<void>;
  createNotification(notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>): Promise<NotificationMessage>;
  deleteNotification(notificationId: string): Promise<void>;
}
