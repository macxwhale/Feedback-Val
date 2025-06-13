
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Info,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = []
}) => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    notifications.length > 0 ? notifications : [
      {
        id: '1',
        type: 'info',
        title: 'New Feedback Session',
        message: '5 new feedback sessions completed today',
        timestamp: '2 minutes ago',
        isRead: false
      },
      {
        id: '2',
        type: 'success',
        title: 'User Invitation Accepted',
        message: 'john.doe@example.com has joined your organization',
        timestamp: '1 hour ago',
        isRead: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'Low Response Rate',
        message: 'Response rate has dropped below 80% this week',
        timestamp: '3 hours ago',
        isRead: true
      }
    ]
  );

  const unreadCount = localNotifications.filter(n => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getVariant = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'secondary';
      case 'warning': return 'destructive';
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const markAsRead = (id: string) => {
    setLocalNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {localNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            localNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg transition-opacity ${
                    notification.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${
                        notification.type === 'warning' || notification.type === 'error' 
                          ? 'text-red-600' 
                          : notification.type === 'success'
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
