import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Calendar, Menu } from 'lucide-react';
import { useDateFilter } from '../contexts/DateFilterContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ title, onToggleMobileMenu, onNavigate, onLogout }) => {
  const { startDate, endDate } = useDateFilter();
  const { theme, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <header className="sticky top-0 z-30 bg-cosmic-card border-b border-cosmic-border px-4 py-3.5 flex items-center justify-between shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Toggle + Title */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-cosmic-muted hover:text-cosmic-text bg-cosmic-bg border border-cosmic-border lg:hidden transition-colors"
          >
            <Menu size={16} />
          </button>
          <div>
            <h1 className="text-base font-black text-cosmic-text leading-tight">{title}</h1>
            <p className="text-[10px] text-cosmic-muted leading-tight">Astroved Enterprise BI Network</p>
          </div>
        </div>

        {/* Right Tools Row */}
        <div className="flex items-center space-x-3">
          {/* Calendar Selector Pill */}
          <button className="hidden sm:flex items-center space-x-2 bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border px-3 py-1.5 rounded-lg text-xs font-semibold text-cosmic-text transition-colors">
            <Calendar size={13} className="text-cosmic-muted" />
            <span>{formatDateString(startDate)} - {formatDateString(endDate)}</span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button className="relative p-1.5 rounded-lg text-cosmic-muted hover:text-cosmic-text bg-cosmic-bg border border-cosmic-border transition-colors">
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
            <button 
              onClick={toggleTheme} 
              className="p-1.5 rounded-lg text-cosmic-muted hover:text-cosmic-text bg-cosmic-bg border border-cosmic-border transition-colors"
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>

          {/* Desktop Profile Info Card (Dropdown button) */}
          <div className="relative border-l border-cosmic-border pl-3">
            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2.5 hover:bg-cosmic-bg border border-transparent hover:border-cosmic-border p-1 px-2 rounded-xl transition-all focus:outline-none"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80"
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-cosmic-border shrink-0"
              />
              <div className="leading-tight hidden sm:block text-left">
                <span className="text-xs font-bold text-cosmic-text block">Admin</span>
                <span className="text-[9px] text-cosmic-muted block">Super Admin</span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl py-1.5 z-50 text-xs font-semibold text-slate-700 dark:text-slate-200 animate-slide-in-right">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('system-settings');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 hover:dark:bg-white/5 transition-colors"
                >
                  Change Password
                </button>
                <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-500 hover:text-white transition-colors text-rose-500 font-bold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
