import React, { useState } from 'react';
import { DateFilterProvider } from './contexts/DateFilterContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Executive from './modules/Executive/Executive';
import Sales from './modules/Sales/Sales';
import Marketing from './modules/Marketing/Marketing';
import SEO from './modules/SEO/SEO';
import Customer from './modules/Customer/Customer';
import Funnel from './modules/Funnel/Funnel';
import Operations from './modules/Operations/Operations';
import AIInsights from './modules/AIInsights/AIInsights';
import ReportsBuilder from './modules/Reports/ReportsBuilder';
import AdminControl from './modules/Admin/AdminControl';
import Login from './components/Login';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import './App.css';


function MainAppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('astroved_user'));
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('astroved_user') ? JSON.parse(localStorage.getItem('astroved_user')) : null
  );
  const [userPermissions, setUserPermissions] = useState(
    localStorage.getItem('astroved_permissions') ? JSON.parse(localStorage.getItem('astroved_permissions')) : null
  );
  const [currentModule, setCurrentModule] = useState('executive');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (user, permissions) => {
    setCurrentUser(user);
    setUserPermissions(permissions);
    localStorage.setItem('astroved_user', JSON.stringify(user));
    localStorage.setItem('astroved_permissions', JSON.stringify(permissions));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserPermissions(null);
    localStorage.removeItem('astroved_user');
    localStorage.removeItem('astroved_permissions');
    setIsLoggedIn(false);
  };

  // Render correct dashboard module
  const renderModule = () => {
    const isAdmin = currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Admin');
    
    // 1. Guard admin panel modules
    if (!isAdmin && [
      'user-management', 'roles-permissions', 'kpi-management',
      'target-management', 'report-scheduler', 'ai-settings', 'system-settings', 'integrations'
    ].includes(currentModule)) {
      return <Executive />;
    }

    // 2. Guard dashboard view permissions based on roles settings
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
    if (permissionMap[currentModule]) {
      const permKey = permissionMap[currentModule];
      if (userPermissions && userPermissions.dashboard && userPermissions.dashboard[permKey] === false) {
        return (
          <div className="p-6 text-center bg-cosmic-card border border-cosmic-border rounded-2xl max-w-md mx-auto mt-10">
            <h3 className="text-sm font-extrabold text-cosmic-text mb-2">Access Denied</h3>
            <p className="text-xs text-cosmic-muted">Your role profile does not have permission to view the {currentModule.replace('-', ' ')} dashboard.</p>
          </div>
        );
      }
    }

    switch (currentModule) {
      case 'executive':
        return <Executive />;
      case 'sales':
        return <Sales />;
      case 'marketing':
        return <Marketing />;
      case 'seo':
        return <SEO />;
      case 'customer':
        return <Customer />;
      case 'funnel':
        return <Funnel />;
      case 'operations':
        return <Operations />;
      case 'ai-insights':
      case 'alerts':
      case 'notifications':
        return <AIInsights setCurrentModule={setCurrentModule} />;
      case 'reports':
      case 'report-scheduler':
      case 'data-management':
      case 'daily-report':
      case 'weekly-report':
      case 'monthly-report':
      case 'quarterly-report':
      case 'yearly-report':
      case 'export-excel':
      case 'export-pdf':
      case 'export-csv':
        return <ReportsBuilder />;
      case 'user-management':
        return <AdminControl initialTab="users" />;
      case 'roles-permissions':
        return <AdminControl initialTab="roles" />;
      case 'kpi-management':
        return <AdminControl initialTab="kpis" />;
      case 'target-management':
        return <AdminControl initialTab="targets" />;
      case 'report-scheduler':
        return <AdminControl initialTab="scheduler" />;
      case 'ai-settings':
        return <AdminControl initialTab="ai" />;
      case 'system-settings':
      case 'integrations':
        return <AdminControl initialTab="system" />;
      default:
        return <Executive />;
    }
  };

  const getModuleTitle = () => {
    const titles = {
      executive: 'Executive Performance Summary',
      sales: 'Sales & Product Performance',
      marketing: 'Marketing Performance & ROI',
      seo: 'Search Engine Optimization (SEO)',
      customer: 'Customer Cohorts & Retention',
      funnel: 'Conversion Funnel Analysis',
      operations: 'Operational Diagnostics',
      'ai-insights': 'AI Anomalies & Insights',
      reports: 'BI Reports Exporter',
      'report-scheduler': 'BI Report Scheduler',
      alerts: 'Strategic Anomaly Alerts',
      notifications: 'System Notifications',
      'data-management': 'Data Management Audit',
      'user-management': 'User Management Settings',
      'roles-permissions': 'Roles & Permissions Authorization',
      'kpi-management': 'KPI Configurator Library',
      'target-management': 'Target Settings Matrix',
      'ai-settings': 'AI Cognitive Settings & Engine',
      'system-settings': 'BI System Configuration',
      integrations: 'Third Party Integrations',
      'daily-report': 'Daily BI Report Scheduler',
      'weekly-report': 'Weekly BI Report Scheduler',
      'monthly-report': 'Monthly BI Report Scheduler',
      'quarterly-report': 'Quarterly BI Report Scheduler',
      'yearly-report': 'Yearly BI Report Scheduler',
      'export-excel': 'Export Data to Excel',
      'export-pdf': 'Export Data to PDF',
      'export-csv': 'Export Data to CSV'
    };
    return titles[currentModule] || 'Dashboard';
  };


  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex bg-cosmic-bg h-screen text-cosmic-text font-sans relative overflow-hidden">


      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        setCurrentModule={(mod) => {
          setCurrentModule(mod);
          setMobileMenuOpen(false); // Close mobile drawer on selection
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        user={currentUser}
        permissions={userPermissions}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={getModuleTitle()}
          onSearch={(val) => console.log('Searching for:', val)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onNavigate={(targetTab) => {
            // Map the tab target to module
            if (targetTab === 'system-settings') {
              setCurrentModule('system-settings');
            }
          }}
          onLogout={handleLogout}
        />

        <main className="p-4 md:p-6 overflow-y-auto flex-1">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <ThemeProvider>
      <DateFilterProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'var(--cosmic-card)',
              color: 'var(--cosmic-text)',
              border: '1px solid var(--cosmic-border)',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#6868f9',
                secondary: '#fff',
              },
            },
          }}
        />
        <MainAppContent />
      </DateFilterProvider>
    </ThemeProvider>
  );
}


export default App;
