import React, { useState } from 'react';
import {
  TrendingUp, ShoppingBag, Megaphone, Search, Users,
  Filter, Activity, Sparkles, User, ShieldAlert, Target, Calendar,
  Sliders, FileText, ArrowRight, File, CreditCard, Box, BarChart3,
  DollarSign, Repeat, Coins, Bell, Cpu, Database, Settings, Headphones
} from 'lucide-react';

const Sidebar = ({ currentModule, setCurrentModule, collapsed, mobileOpen, user, permissions }) => {
  const [reportsOpen, setReportsOpen] = useState(false);

  const mainMenu = [
    { id: 'executive', name: 'Executive Dashboard', icon: TrendingUp },
    { id: 'sales', name: 'Sales Dashboard', icon: ShoppingBag },
    { id: 'marketing', name: 'Marketing Dashboard', icon: Megaphone },
    { id: 'seo', name: 'SEO Dashboard', icon: Search },
    { id: 'customer', name: 'Customer Dashboard', icon: Users },
    { id: 'funnel', name: 'Funnel Dashboard', icon: Filter },
    { id: 'operations', name: 'Operations Dashboard', icon: Activity },
    { id: 'ai-insights', name: 'AI Insights', icon: Sparkles, badge: 'NEW' },
  ];

  const permissionMap = {
    executive: 'executive',
    sales: 'sales',
    marketing: 'marketing',
    seo: 'seo',
    customer: 'customer',
    funnel: 'funnel',
    operations: 'operations',
    'ai-insights': 'ai'
  };

  const filteredMainMenu = mainMenu.filter(item => {
    if (!permissions || !permissions.dashboard) return true;
    const permKey = permissionMap[item.id];
    return permissions.dashboard[permKey] !== false;
  });

  const adminPanel = [
    { id: 'user-management', name: 'User Management', icon: User },
    { id: 'roles-permissions', name: 'Roles & Permissions', icon: ShieldAlert },
    { id: 'kpi-management', name: 'KPI Management', icon: Sliders },
    { id: 'target-management', name: 'Target Management', icon: Target },
    { id: 'report-scheduler', name: 'Report Scheduler', icon: Calendar },
    { id: 'ai-settings', name: 'AI Settings', icon: Sparkles },
  ];

  const renderNavGroup = (title, items) => (
    <div className="space-y-1">
      {!collapsed && (
        <span className="text-[9px] font-bold text-cosmic-muted tracking-widest uppercase pl-4 block opacity-60">
          {title}
        </span>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;



          return (
            <button
              key={item.id}
              onClick={() => setCurrentModule(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-indigo-600 text-white border-black dark:border-indigo-400 shadow-md shadow-indigo-600/20'
                  : 'border-transparent text-cosmic-muted hover:bg-cosmic-card-hover hover:text-cosmic-text'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon size={15} className={isActive ? 'text-white' : 'text-cosmic-muted'} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </div>
              {item.badge && !collapsed && (
                <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-fuchsia-600 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`bg-cosmic-card border-r border-cosmic-border w-64 h-screen flex flex-col justify-between p-4 z-40 shrink-0 fixed lg:static inset-y-0 left-0 transform lg:transform-none transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      
      <div className="space-y-3 flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center w-full px-2 py-2 space-y-1 shrink-0">
          {collapsed ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 mx-auto">
              <span className="text-white font-black text-xs">AV</span>
            </div>
          ) : (
            <>
              <img 
                src="https://cdn.astroved.com/images/images-av/AstroVed-Logo.svg" 
                alt="AstroVed Logo" 
                className="h-8 max-w-full object-contain filter brightness-110 mx-auto" 
              />
              <span className="text-[9px] font-bold text-cosmic-muted tracking-wider uppercase block text-center">
                Business Intelligence
              </span>
            </>
          )}
        </div>

        {/* Scrollable Nav Area */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1 min-h-0">
          {renderNavGroup('MAIN MENU', filteredMainMenu)}
          {user && (user.role === 'Super Admin' || user.role === 'Admin') && renderNavGroup('ADMIN PANEL', adminPanel)}
        </div>
      </div>

      {/* Bottom Support Card */}
      <div className="pt-2 border-t border-cosmic-border shrink-0">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center space-x-3 cursor-pointer hover:bg-indigo-500/10 transition-colors">
            <Headphones size={15} className="text-indigo-400 shrink-0" />
            <div className="leading-tight">
              <p className="text-xs font-bold text-cosmic-text">Need Help?</p>
              <p className="text-[9px] text-cosmic-muted mt-0.5">Contact Support</p>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
