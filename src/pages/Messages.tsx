import React, { useCallback, useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Mail, Check, Bell, Send, Inbox, CheckCircle2, Clock } from 'lucide-react';
import { messagesService, MessageNotification } from '../services/messagesService';
import { useNotifications } from '../contexts/NotificationContext';

type StatusMessage = {
  type: 'success' | 'error';
  text: string;
};

const FALLBACK_NOTIFICATIONS: MessageNotification[] = [
  {
    id: 'fallback-1',
    message: 'Candidate John Doe shortlisted for Senior Developer role',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
    type: 'candidate'
  },
  {
    id: 'fallback-2',
    message: 'Interview scheduled with Sarah Johnson for tomorrow at 10:00 AM',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
    type: 'interview'
  },
  {
    id: 'fallback-3',
    message: 'Offer sent to Michael Chen - awaiting response',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: 'offer'
  }
];

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

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const Messages: React.FC = () => {
  const { syncNotifications } = useNotifications();
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const [emailForm, setEmailForm] = useState({
    recipient: '',
    subject: '',
    body: ''
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await messagesService.getNotifications();

      if (response.success && Array.isArray(response.data)) {
        const normalised = response.data.map((notif, index) => ({
          id: notif.id || `notification-${index}`,
          message: notif.message,
          timestamp: notif.timestamp || new Date().toISOString(),
          read: Boolean(notif.read),
          type: normalizeNotificationType(notif.type)
        }));

        setNotifications(normalised);
        syncNotifications(normalised);
      } else {
        setNotifications([]);
        syncNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setStatusMessage({ type: 'error', text: 'Unable to load notifications from the server. Showing recent local updates instead.' });
      setNotifications(FALLBACK_NOTIFICATIONS);
      syncNotifications(FALLBACK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, [syncNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    const timeout = setTimeout(() => setStatusMessage(null), 4000);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await messagesService.markAsRead(id);
      const updated = notifications.map(notif => (notif.id === id ? { ...notif, read: true } : notif));
      setNotifications(updated);
      syncNotifications(updated);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setStatusMessage({ type: 'error', text: 'Unable to update notification state. Please try again.' });
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) {
      return;
    }

    try {
      setMarkingAll(true);
      await Promise.all(unread.map(notification => messagesService.markAsRead(notification.id)));
      const updated = notifications.map(notif => ({ ...notif, read: true }));
      setNotifications(updated);
      syncNotifications(updated);
      setStatusMessage({ type: 'success', text: 'All notifications marked as read.' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setStatusMessage({ type: 'error', text: 'Failed to mark all notifications as read. Please try again.' });
    } finally {
      setMarkingAll(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSendingEmail(true);
      const response = await messagesService.sendEmail({
        recipient: emailForm.recipient,
        subject: emailForm.subject,
        body: emailForm.body
      });

      setStatusMessage({
        type: 'success',
        text: response.message || 'Email sent successfully.'
      });

      setEmailForm({ recipient: '', subject: '', body: '' });
      await fetchNotifications();
    } catch (error) {
      console.error('Error sending email:', error);
      const message = error instanceof Error ? error.message : 'Failed to send email. Please try again.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSendingEmail(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'candidate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interview':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'offer':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'project':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Messages & Notifications</h1>
            <p className="text-gray-600 flex items-center">
              <Inbox className="w-4 h-4 mr-2" />
              Manage your email communication and system alerts
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="shadow-md hover:shadow-lg transition-shadow"
              isLoading={markingAll}
            >
              {!markingAll && <CheckCircle2 className="w-4 h-4 mr-2" />}
              {markingAll ? 'Updating...' : `Mark All as Read (${unreadCount})`}
            </Button>
          )}
        </div>

        {statusMessage && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
              statusMessage.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Bell className="w-6 h-6 mr-3 text-blue-600" />
                  Notifications
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-medium">
                    {notifications.length} total
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No notifications yet</p>
                  <p className="text-gray-400 text-sm mt-2">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        notification.read
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-blue-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            {!notification.read && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                              </span>
                            )}
                          </div>
                          <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-2 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="ml-4 p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-green-600" />
                Send Email
              </h2>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipient
                  </label>
                  <input
                    required
                    type="email"
                    value={emailForm.recipient}
                    onChange={e => setEmailForm(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    required
                    value={emailForm.subject}
                    onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    value={emailForm.body}
                    onChange={e => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    rows={6}
                    placeholder="Type your message here..."
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full shadow-md hover:shadow-lg transition-shadow"
                  isLoading={sendingEmail}
                >
                  {!sendingEmail && <Send className="w-4 h-4 mr-2" />}
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-3 font-semibold flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Automated emails sent on:
                </p>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Candidate shortlisted
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Interview scheduled
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Offer sent
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Project assignment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
