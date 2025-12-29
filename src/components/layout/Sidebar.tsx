import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Mail,
  Settings,
  HelpCircle,
  User as UserIcon,
  Search
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard Overview' },
  { path: '/hiresmart', label: 'HireSmart', icon: Target, tooltip: 'Upload & Parse Resumes' },
  { path: '/talent-scout', label: 'Talent Scout', icon: Search, tooltip: 'Search LinkedIn & Naukri' },
  { path: '/automatch', label: 'AutoMatch', icon: Users, tooltip: 'Internal Mobility & Project Matching' },
  { path: '/salary-analysis', label: 'Salary Analysis', icon: DollarSign, tooltip: 'Salary Benchmarking' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, tooltip: 'HR Analytics Dashboard' },
  { path: '/messages', label: 'Messages', icon: Mail, tooltip: 'Internal Communication' },
  { path: '/settings', label: 'Settings', icon: Settings, tooltip: 'Platform Settings' },
  { path: '/help', label: 'Help & Info', icon: HelpCircle, tooltip: 'Help & Information' }
];

export const Sidebar: React.FC = () => {
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

        {/* User Profile */}
        <div className="border-t border-neutral-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
              HN
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-text">HumaNet User</p>
              <p className="text-xs text-neutral-muted capitalize">HR Leader</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
