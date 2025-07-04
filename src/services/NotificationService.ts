
/**
 * Notification Service Implementation
 * Handles notification management and delivery
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  INotificationService, 
  NotificationMessage, 
  NotificationFilters 
} from '@/domain/interfaces/INotificationService';

export class NotificationService implements INotificationService {
  async getNotifications(filters?: NotificationFilters): Promise<NotificationMessage[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.read !== undefined) {
        query = query.eq('is_read', filters.read);
      }
      
      if (filters?.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return (data || []).map(this.mapToNotificationMessage);
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(organizationId?: string): Promise<void> {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { error } = await query;
      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async createNotification(
    notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>
  ): Promise<NotificationMessage> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          organization_id: notification.organizationId,
          user_id: notification.userId,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapToNotificationMessage(data);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  private mapToNotificationMessage(data: any): NotificationMessage {
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      timestamp: new Date(data.created_at),
      read: data.is_read,
      organizationId: data.organization_id,
      userId: data.user_id
    };
  }
}
