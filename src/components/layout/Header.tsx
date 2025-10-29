import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent">HumaNet Platform</h1>
        <p className="text-sm text-slate-600">Human capital intelligence for modern teams.</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/messages')}
          className="relative p-2 rounded-full hover:bg-indigo-50 transition-all group"
        >
          <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-indigo-600' : 'text-slate-600'} group-hover:scale-110 transition-transform`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'HN'}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{user?.name || 'HumaNet User'}</div>
            <div className="text-xs text-slate-600 capitalize">{user?.role || 'Role'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
