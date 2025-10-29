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
  User as UserIcon,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard Overview' },
  { path: '/hiresmart', label: 'HireSmart', icon: Target, tooltip: 'Upload & Parse Resumes' },
  { path: '/talent-scout', label: 'Talent Scout', icon: Search, tooltip: 'Search LinkedIn & Naukri' },
  { path: '/automatch', label: 'AutoMatch', icon: Users, tooltip: 'AI-Powered Team Matching' },
  { path: '/salary-analysis', label: 'Salary Analysis', icon: DollarSign, tooltip: 'Salary Benchmarking' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, tooltip: 'HR Analytics Dashboard' },
  { path: '/messages', label: 'Messages', icon: Mail, tooltip: 'Internal Communication' },
  { path: '/settings', label: 'Settings', icon: Settings, tooltip: 'Platform Settings' },
  { path: '/help', label: 'Help & Info', icon: HelpCircle, tooltip: 'Help & Information' }
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
    <div className="w-64 h-screen sticky top-0 flex flex-col relative bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 shadow-xl">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

      <div className="relative z-10 flex flex-col h-full text-white">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white drop-shadow-lg">HumaNet</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.tooltip || item.label}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/25 backdrop-blur-md text-white shadow-lg border border-white/40'
                    : 'text-white/80 hover:bg-white/15 hover:backdrop-blur-md hover:text-white hover:shadow-md'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/20">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(prev => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/15 backdrop-blur-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/30">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/70 capitalize">{user?.role || 'Role'}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/20 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/30">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/20 transition-colors text-red-300 hover:text-red-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-6 w-80 border border-gray-200">
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
    </div>
  );
};
