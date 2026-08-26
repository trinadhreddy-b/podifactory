import React from 'react';
import { useStore } from '../context/StoreContext';
import { Palette, ShieldCheck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, setIsThemeDrawerOpen, isAdminAuthenticated, setIsAdminDashboardOpen, setIsAdminModalOpen } = useStore();

  return (
    <div
      id="announcement-bar"
      className="bg-brand-primary text-brand-on-primary py-2 px-4 text-xs sm:text-sm font-sans-brand transition-colors"
      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide">{settings.announcement}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="quick-theme-btn"
            onClick={() => setIsThemeDrawerOpen(true)}
            className="flex items-center gap-1 opacity-90 hover:opacity-100 hover:underline cursor-pointer text-xs font-semibold tracking-wider uppercase font-label-brand px-2 py-0.5 rounded transition"
          >
            <Palette className="w-3 h-3" />
            <span>Theme</span>
          </button>
          <span className="opacity-40">|</span>
          <button
            id="quick-admin-link"
            onClick={() => (isAdminAuthenticated ? setIsAdminDashboardOpen(true) : setIsAdminModalOpen(true))}
            className="flex items-center gap-1 opacity-90 hover:opacity-100 hover:underline cursor-pointer text-xs font-semibold tracking-wider uppercase font-label-brand px-2 py-0.5 rounded transition"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
