import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Mail,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hiresmart', label: 'HireSmart', icon: Target },
  { path: '/automatch', label: 'AutoMatch', icon: Users },
  { path: '/salary-analysis', label: 'Salary Analysis', icon: DollarSign },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/messages', label: 'Messages', icon: Mail },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help & Info', icon: HelpCircle }
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col relative">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">HumaNet</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role || 'Role'}</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showProfileDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 rounded-lg shadow-xl p-6 w-72">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to logout?</p>
            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
