
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const fetchNotifications = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
  return data as Notification[];
};

export const useRealtimeNotifications = (organizationId: string) => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', organizationId],
    queryFn: () => fetchNotifications(organizationId),
    enabled: !!organizationId,
  });

  useEffect(() => {
    if (!organizationId) return;

    const channel = supabase
      .channel(`realtime-notifications-${organizationId}`)
      .on<Notification>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          queryClient.setQueryData(['notifications', organizationId], (oldData: Notification[] | undefined) => {
            return [payload.new, ...(oldData || [])];
          });
          sonnerToast.info(payload.new.title, {
            description: payload.new.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, queryClient]);

  const markAsRead = async (notificationId: string) => {
    queryClient.setQueryData(['notifications', organizationId], (oldData: Notification[] | undefined) => 
        oldData?.map(n => n.id === notificationId ? { ...n, is_read: true } : n) || []
    );

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      sonnerToast.error('Could not mark notification as read.');
      queryClient.invalidateQueries({ queryKey: ['notifications', organizationId] });
    }
  };

  return { notifications, isLoading, markAsRead };
};
