import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

export const Header: React.FC = () => {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const initials = 'HN';

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-muted">HUMANET</span>
          <h1 className="text-xl font-semibold text-neutral-text">HR Intelligence Platform</h1>
          <p className="text-sm text-neutral-subtler">Confident decisions for people leaders at enterprise scale.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/messages')}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-border bg-white text-neutral-text transition-all duration-200 ease-gentle hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-subtle"
            aria-label="View notifications"
          >
            <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-brand-primary' : 'text-neutral-subtler'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-semantic-error text-[11px] font-semibold text-white shadow-subtle">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-border bg-white px-4 py-2.5 shadow-subtle">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-neutral-text">HumaNet User</p>
              <p className="text-xs text-neutral-muted">HR Leader</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
