import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: 'New candidate shortlisted: John Doe', time: '2m ago' },
    { id: 2, message: 'Interview scheduled with Sarah Lee', time: '1h ago' },
    { id: 3, message: 'Offer sent to Michael Chen', time: '3h ago' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">HumaNet Platform</h1>
        <p className="text-sm text-gray-500">Human capital intelligence for modern teams.</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/messages')}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'HN'}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{user?.name || 'HumaNet User'}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
