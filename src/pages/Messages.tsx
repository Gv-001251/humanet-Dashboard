import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Mail, Check, Bell } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'candidate' | 'interview' | 'offer' | 'project' | 'general';
}

export const Messages: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Candidate John Doe shortlisted for Senior Developer role',
      timestamp: '2 minutes ago',
      read: false,
      type: 'candidate'
    },
    {
      id: '2',
      message: 'Interview scheduled with Sarah Johnson for tomorrow at 10:00 AM',
      timestamp: '1 hour ago',
      read: false,
      type: 'interview'
    },
    {
      id: '3',
      message: 'Offer sent to Michael Chen - awaiting response',
      timestamp: '3 hours ago',
      read: true,
      type: 'offer'
    },
    {
      id: '4',
      message: 'Project "AI Dashboard" assigned new team member: Priya Singh',
      timestamp: '5 hours ago',
      read: true,
      type: 'project'
    },
    {
      id: '5',
      message: 'Monthly performance review cycle starting next week',
      timestamp: '1 day ago',
      read: true,
      type: 'general'
    }
  ]);

  const [emailForm, setEmailForm] = useState({
    recipient: '',
    subject: '',
    body: ''
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email sent to ${emailForm.recipient}`);
    setEmailForm({ recipient: '', subject: '', body: '' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'candidate':
        return 'bg-blue-100 text-blue-700';
      case 'interview':
        return 'bg-green-100 text-green-700';
      case 'offer':
        return 'bg-orange-100 text-orange-700';
      case 'project':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Messages & Notifications</h1>
            <p className="text-gray-600">Email notifications and system alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  Notifications
                </h2>
                <span className="text-sm text-gray-500">{notifications.length} total</span>
              </div>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-800">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="ml-4 p-2 hover:bg-white rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Send Email */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Send Email
              </h2>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                  <input
                    required
                    type="email"
                    value={emailForm.recipient}
                    onChange={e => setEmailForm(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    required
                    value={emailForm.subject}
                    onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    value={emailForm.body}
                    onChange={e => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    placeholder="Email body"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Send Email
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Automated emails sent on:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Candidate shortlisted</li>
                  <li>• Interview scheduled</li>
                  <li>• Offer sent</li>
                  <li>• Project assignment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
