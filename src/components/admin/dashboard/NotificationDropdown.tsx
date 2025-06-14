
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  notifications?: Notification[];
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = []
}) => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    notifications.length > 0 ? notifications : [
      {
        id: '1',
        type: 'info',
        title: 'New Analytics Data',
        message: '25 new responses recorded in the last hour',
        timestamp: '5 min ago',
        isRead: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Response Rate',
        message: 'Response rate dropped below 75% for Customer Service category',
        timestamp: '1 hour ago',
        isRead: false
      },
      {
        id: '3',
        type: 'success',
        title: 'Target Achieved',
        message: 'Monthly feedback target reached!',
        timestamp: '2 hours ago',
        isRead: true
      }
    ]
  );

  const unreadCount = localNotifications.filter(n => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4" />;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold">Notifications</div>
        <DropdownMenuSeparator />
        {localNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          localNotifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-0">
              <div className={`w-full p-3 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
