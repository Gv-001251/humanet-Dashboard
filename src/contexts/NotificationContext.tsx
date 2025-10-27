import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { messagesService, MessageNotification } from '../services/messagesService';

interface NotificationContextType {
  unreadCount: number;
  notifications: MessageNotification[];
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  syncNotifications: (notifications: MessageNotification[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

const normalizeNotificationType = (type?: string): MessageNotification['type'] => {
  switch (type) {
    case 'candidate':
    case 'interview':
    case 'offer':
    case 'project':
    case 'general':
      return type;
    default:
      return 'general';
  }
};

const normalizeNotification = (notif: Partial<MessageNotification> | undefined, index: number): MessageNotification => ({
  id: notif?.id || `notification-${index}`,
  message: notif?.message || 'Notification update',
  timestamp: notif?.timestamp || new Date().toISOString(),
  read: Boolean(notif?.read),
  type: normalizeNotificationType((notif as { type?: string })?.type)
});

const mapNotifications = (items: unknown[]): MessageNotification[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => normalizeNotification(item as Partial<MessageNotification>, index));
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const syncNotifications = useCallback((notifs: MessageNotification[]) => {
    setNotifications(notifs);
    const unread = notifs.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const response = await messagesService.getNotifications();
      if (response.success && response.data) {
        const normalizedData = mapNotifications(response.data);
        syncNotifications(normalizedData);
      } else {
        syncNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [syncNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await messagesService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        refreshNotifications,
        markAsRead,
        syncNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
