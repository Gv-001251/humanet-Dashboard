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
    <div className="sticky top-0 flex h-screen w-64 flex-col border-r border-neutral-border bg-white shadow-subtle relative">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="border-b border-neutral-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm">
              <UserIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-neutral-text">HumaNet</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-muted">Intelligence</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.tooltip || item.label}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-gentle ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary shadow-sm'
                    : 'text-neutral-subtler hover:bg-slate-50 hover:text-neutral-text'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-neutral-border p-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 ease-gentle hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-neutral-text">{user?.name || 'User'}</p>
                  <p className="text-xs text-neutral-muted capitalize">{user?.role || 'Role'}</p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-neutral-muted transition-transform ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showProfileDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-neutral-border bg-white shadow-subtle">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-semantic-error transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {showLogoutConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-80 rounded-xl border border-neutral-border bg-white p-6 shadow-subtle">
              <h3 className="mb-1 text-lg font-semibold text-neutral-text">Confirm Logout</h3>
              <p className="mb-6 text-sm text-neutral-subtler">Are you sure you want to logout?</p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
