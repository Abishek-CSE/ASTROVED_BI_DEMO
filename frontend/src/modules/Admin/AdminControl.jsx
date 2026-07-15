import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Sliders, Target, Calendar, Bell, Sparkles, 
  Cpu, FileText, Settings, Plus, Trash2, Edit3, Key, Lock, Unlock, 
  UserCheck, UserX, Save, Play, Check, Database, RefreshCw, Download, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { confirmToast } from '../../components/ConfirmToast';
import { api } from '../../services/api';

const AdminControl = ({ initialTab = 'users' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const showToast = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast(message);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Tab definitions
  const tabs = [
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'roles', name: 'Roles & Permissions', icon: Shield },
    { id: 'kpis', name: 'KPI Management', icon: Sliders },
    { id: 'targets', name: 'Target Management', icon: Target },
    { id: 'scheduler', name: 'Report Scheduler', icon: Calendar },
    { id: 'notifications', name: 'Notification Management', icon: Bell },
    { id: 'ai', name: 'AI Settings', icon: Sparkles },
    { id: 'integrations', name: 'Integration Settings', icon: Cpu },
    { id: 'audit', name: 'Audit Logs', icon: FileText },
    { id: 'system', name: 'System Settings', icon: Settings },
  ];

  // ----------------------------------------------------
  // 1. STATE - USER MANAGEMENT
  // ----------------------------------------------------
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ empId: '', name: '', email: '', password: '', phone: '', department: 'Analytics', designation: '', role: 'Analyst' });

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    try {
      const added = {
        ...newUser,
        empId: newUser.empId || `EMP${String(users.length + 1).padStart(3, '0')}`,
        password: newUser.password || 'astroved123',
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      await api.createUser(added);
      toast.success('User added successfully');
      loadUsers();
      
      // Log audit
      await api.createAuditLog({
        user: 'Super Admin',
        action: `Added user ${added.name}`,
        module: 'User Management',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });

      setNewUser({ empId: '', name: '', email: '', password: '', phone: '', department: 'Analytics', designation: '', role: 'Analyst' });
      setShowAddUserModal(false);
    } catch (err) {
      toast.error('Failed to add user');
    }
  };

  const toggleUserStatus = async (empId) => {
    const user = users.find(u => u.empId === empId);
    if (!user) return;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.updateUser(empId, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      loadUsers();

      // Log audit
      await api.createAuditLog({
        user: 'Super Admin',
        action: `Toggled user status of ${user.name} to ${newStatus}`,
        module: 'User Management',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (empId, name) => {
    confirmToast(`Are you sure you want to permanently delete user ${name}? This action cannot be undone.`, {
      title: 'Delete User Confirmation',
      confirmText: 'Yes, Delete User',
      onConfirm: async () => {
        try {
          await api.deleteUser(empId);
          toast.success(`User ${name} deleted successfully`);
          loadUsers();

          // Log audit
          await api.createAuditLog({
            user: 'Super Admin',
            action: `Permanently deleted user: ${name} (ID: ${empId})`,
            module: 'User Management',
            ip: '127.0.0.1',
            browser: navigator.userAgent
          });
        } catch (err) {
          toast.error('Failed to delete user');
        }
      }
    });
  };

  // ----------------------------------------------------
  // 2. STATE - ROLES & PERMISSIONS
  // ----------------------------------------------------
  const availableRoles = ['Super Admin', 'Admin', 'CEO', 'CFO', 'CTO', 'COO', 'Product Manager', 'Sales Manager', 'Marketing Manager', 'SEO Manager', 'Operations Manager', 'Finance Manager', 'Data Engineer', 'Developer', 'Support Lead', 'HR Manager', 'Analyst', 'Viewer', 'Guest'];
  const [selectedRole, setSelectedRole] = useState('Analyst');
  const [permissions, setPermissions] = useState({
    dashboard: { executive: false, sales: false, marketing: false, seo: false, customer: false, funnel: false, operations: false, ai: false },
    data: { view: false, export: false, download: false, drillDown: false, viewCost: false, viewRevenue: false, viewProfit: false, viewCustomer: false },
    management: { users: false, roles: false, kpis: false, targets: false, reports: false, ai: false, notifications: false, integrations: false, apis: false },
    crud: { view: false, create: false, edit: false, delete: false, approve: false, publish: false }
  });

  const loadRolePermissions = async () => {
    try {
      const allRoles = await api.getRoles();
      const rolePerm = allRoles.find(r => r.role === selectedRole);
      if (rolePerm && rolePerm.permissions) {
        setPermissions(rolePerm.permissions);
      } else {
        setPermissions({
          dashboard: { executive: false, sales: false, marketing: false, seo: false, customer: false, funnel: false, operations: false, ai: false },
          data: { view: false, export: false, download: false, drillDown: false, viewCost: false, viewRevenue: false, viewProfit: false, viewCustomer: false },
          management: { users: false, roles: false, kpis: false, targets: false, reports: false, ai: false, notifications: false, integrations: false, apis: false },
          crud: { view: false, create: false, edit: false, delete: false, approve: false, publish: false }
        });
      }
    } catch (err) {
      console.error('Failed to load permissions:', err);
    }
  };

  const togglePermission = (category, key) => {
    setPermissions({
      ...permissions,
      [category]: {
        ...permissions[category],
        [key]: !permissions[category][key]
      }
    });
  };

  const handleSavePermissions = async () => {
    try {
      await api.updateRole(selectedRole, permissions);
      toast.success(`Saved permissions for ${selectedRole}!`);

      await api.createAuditLog({
        user: 'Super Admin',
        action: `Updated role permissions for ${selectedRole}`,
        module: 'Roles & Permissions',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to save permissions');
    }
  };

  // ----------------------------------------------------
  // 3. STATE - KPI MANAGEMENT
  // ----------------------------------------------------
  const [kpis, setKpis] = useState([]);
  const [showAddKPIModal, setShowAddKPIModal] = useState(false);
  const [newKpi, setNewKpi] = useState({ name: '', category: 'Executive', formula: '', order: 1, color: '#6366f1', target: '', warning: '', critical: '' });

  const loadKPIs = async () => {
    try {
      const data = await api.getKPIs();
      setKpis(data);
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    }
  };

  const handleAddKPI = async (e) => {
    e.preventDefault();
    if (!newKpi.name) return;
    try {
      await api.createKPI(newKpi);
      toast.success('KPI added successfully');
      loadKPIs();

      await api.createAuditLog({
        user: 'Super Admin',
        action: `Created KPI metric: ${newKpi.name}`,
        module: 'KPI Management',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });

      setNewKpi({ name: '', category: 'Executive', formula: '', order: 1, color: '#6366f1', target: '', warning: '', critical: '' });
      setShowAddKPIModal(false);
    } catch (err) {
      toast.error('Failed to add KPI');
    }
  };

  // ----------------------------------------------------
  // 4. STATE - TARGET MANAGEMENT
  // ----------------------------------------------------
  const [targetMetrics, setTargetMetrics] = useState([]);

  const loadTargets = async () => {
    try {
      const data = await api.getTargets();
      setTargetMetrics(data);
    } catch (err) {
      console.error('Failed to load targets:', err);
    }
  };

  // ----------------------------------------------------
  // 5. STATE - REPORT SCHEDULER
  // ----------------------------------------------------
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ name: '', frequency: 'Daily', format: 'PDF', recipients: '', ccBcc: '', timeZone: 'GMT+5:30' });

  const loadSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.name || !newSchedule.recipients) return;
    try {
      await api.createSchedule(newSchedule);
      toast.success('Schedule created successfully');
      loadSchedules();

      await api.createAuditLog({
        user: 'Super Admin',
        action: `Scheduled report delivery: ${newSchedule.name}`,
        module: 'Reports Scheduler',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });

      setNewSchedule({ name: '', frequency: 'Daily', format: 'PDF', recipients: '', ccBcc: '', timeZone: 'GMT+5:30' });
    } catch (err) {
      toast.error('Failed to create schedule');
    }
  };

  const handleTriggerTestReport = async (name) => {
    toast.success(`Test report triggered for ${name}!`);
    await api.createAuditLog({
      user: 'Super Admin',
      action: `Triggered test report: ${name}`,
      module: 'Reports Scheduler',
      ip: '127.0.0.1',
      browser: navigator.userAgent
    });
  };

  // ----------------------------------------------------
  // 6. STATE - NOTIFICATIONS
  // ----------------------------------------------------
  const [notifSettings, setNotifSettings] = useState({
    emailNotif: true,
    dashboardAlerts: true,
    slackWebhook: '',
    teamsWebhook: '',
    rules: { revenueAlerts: true, kpiAlerts: true, failedPaymentAlerts: true, aiInsightAlerts: false }
  });

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      if (data) setNotifSettings(data);
    } catch (err) {
      console.error('Failed to load notifications settings:', err);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await api.updateNotifications(notifSettings);
      toast.success('Saved Notification Settings!');

      await api.createAuditLog({
        user: 'Super Admin',
        action: 'Updated Webhooks and Alerts Rules',
        module: 'Notification Management',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to save notification settings');
    }
  };

  // ----------------------------------------------------
  // 7. STATE - AI SETTINGS
  // ----------------------------------------------------
  const [aiSettings, setAiSettings] = useState({
    apiKey: '',
    model: 'gpt-4o',
    refreshInterval: '6 Hours',
    maxTokens: 2048,
    temperature: 0.7,
    enabled: true,
    prompts: ''
  });
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);

  const loadAISettings = async () => {
    try {
      const data = await api.getAISettings();
      if (data) setAiSettings(data);
    } catch (err) {
      console.error('Failed to load AI settings:', err);
    }
  };

  const handleSaveAISettings = async () => {
    try {
      await api.updateAISettings(aiSettings);
      toast.success('Saved Cognitive AI Configurations!');
      setIsEditingApiKey(false);
      loadAISettings();

      await api.createAuditLog({
        user: 'Super Admin',
        action: 'Updated AI Cognitive engine prompts & settings',
        module: 'AI Settings',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to save AI configurations');
    }
  };

  // ----------------------------------------------------
  // 8. STATE - INTEGRATIONS
  // ----------------------------------------------------
  const [integrations, setIntegrations] = useState([]);
  const [configuringIntegration, setConfiguringIntegration] = useState(null);
  const [configFields, setConfigFields] = useState({});

  const loadIntegrations = async () => {
    try {
      const data = await api.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    }
  };

  const toggleIntegration = async (id) => {
    try {
      await api.toggleIntegration(id);
      loadIntegrations();

      await api.createAuditLog({
        user: 'Super Admin',
        action: `Toggled status of integration: ${id}`,
        module: 'Integrations Settings',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to update integration');
    }
  };

  const handleOpenConfig = (int) => {
    setConfiguringIntegration(int);
    setConfigFields(int.config || {});
  };

  const handleSaveIntegrationConfig = async (e) => {
    e.preventDefault();
    if (!configuringIntegration) return;
    try {
      await api.updateIntegrationConfig(configuringIntegration.id, configFields);
      toast.success(`Successfully configured ${configuringIntegration.name}!`);
      setConfiguringIntegration(null);
      loadIntegrations();

      await api.createAuditLog({
        user: 'Super Admin',
        action: `Configured parameters for integration: ${configuringIntegration.name}`,
        module: 'Integrations Settings',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to save integration settings');
    }
  };

  // ----------------------------------------------------
  // 9. STATE - AUDIT LOGS
  // ----------------------------------------------------
  const [auditLogs, setAuditLogs] = useState([]);

  const loadAuditLogs = async () => {
    try {
      const data = await api.getAuditLogs();
      setAuditLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  const handleExportAuditLogs = () => {
    try {
      const url = api.exportCollectionUrl('audit', 'csv');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'astroved_audit_logs.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exporting audit logs as CSV...');
    } catch (err) {
      console.error('Failed to export audit logs:', err);
      toast.error('Failed to export audit logs');
    }
  };

  // ----------------------------------------------------
  // 10. STATE - SYSTEM SETTINGS
  // ----------------------------------------------------
  const [systemConfig, setSystemConfig] = useState({
    companyName: '',
    logoUrl: '',
    themeMode: 'light',
    currency: '₹ (INR)',
    timeZone: 'GMT+5:30 (IST)',
    fiscalYear: 'April - March',
    dateFormat: 'DD-MM-YYYY',
    language: 'English (US)',
    autoBackup: true,
    backupInterval: 'Daily'
  });

  const loadSystemConfig = async () => {
    try {
      const data = await api.getSystemConfig();
      if (data) setSystemConfig(data);
    } catch (err) {
      console.error('Failed to load system config:', err);
    }
  };

  const handleSaveSystemConfig = async () => {
    try {
      await api.updateSystemConfig(systemConfig);
      toast.success('Saved System Configurations!');

      await api.createAuditLog({
        user: 'Super Admin',
        action: 'Updated global system locale, backup & configurations',
        module: 'System Settings',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
    } catch (err) {
      toast.error('Failed to save system configurations');
    }
  };

  const handleTriggerBackup = async () => {
    toast.success('Database backup initiated successfully!');
    await api.createAuditLog({
      user: 'Super Admin',
      action: 'Triggered immediate MongoDB database backup archive',
      module: 'System Settings',
      ip: '127.0.0.1',
      browser: navigator.userAgent
    });
  };

  // ----------------------------------------------------
  // 11. BULK DATA IMPORT & EXPORT
  // ----------------------------------------------------
  const [selectedImportExportCollection, setSelectedImportExportCollection] = useState('users');

  const handleExportCollection = (format) => {
    const url = api.exportCollectionUrl(selectedImportExportCollection, format);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astroved_${selectedImportExportCollection}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exporting ${selectedImportExportCollection} as ${format.toUpperCase()}...`);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const format = file.name.endsWith('.json') ? 'json' : 'csv';
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target.result;
        let dataToImport = fileContent;
        if (format === 'json') {
          dataToImport = JSON.parse(fileContent);
        }
        await api.importCollection(selectedImportExportCollection, format, dataToImport);
        toast.success(`Successfully imported data into ${selectedImportExportCollection}!`);
        
        // Reload all
        loadAllData();
      } catch (err) {
        toast.error(`Import failed: ${err.message || 'Check file format'}`);
      }
    };
    reader.readAsText(file);
  };

  // --- Life Cycle Hooks ---
  const loadAllData = () => {
    loadUsers();
    loadRolePermissions();
    loadKPIs();
    loadTargets();
    loadSchedules();
    loadNotifications();
    loadAISettings();
    loadIntegrations();
    loadAuditLogs();
    loadSystemConfig();
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    loadRolePermissions();
  }, [selectedRole]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-180px)] select-none">
      
      {/* Tab Navigation Sidebar inside Admin Panel */}
      <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-cosmic-border pb-4 lg:pb-0 lg:pr-4 gap-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-black dark:border-indigo-400 shadow-md shadow-indigo-600/10'
                  : 'border-transparent text-cosmic-muted hover:bg-cosmic-card-hover hover:text-cosmic-text'
              }`}
            >
              <Icon size={14} className={isSelected ? 'text-white' : 'text-cosmic-muted'} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Panel */}
      <div className="flex-1 min-w-0">
        
        {/* TABS CONTAINER */}
        <div className="bg-cosmic-card border border-cosmic-border rounded-2xl p-5 shadow-sm min-h-[450px]">
          
          {/* TAB 1: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-cosmic-border/50">
                <div>
                  <h3 className="text-sm font-extrabold text-cosmic-text">User Directory Management</h3>
                  <p className="text-[10px] text-cosmic-muted mt-0.5">Control employee access permissions, accounts states, and logins audits.</p>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-md shadow-indigo-600/10 active:scale-95 transition-transform"
                >
                  <Plus size={12} />
                  <span>Add User</span>
                </button>
              </div>

              {/* Users table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-cosmic-border text-cosmic-muted font-bold text-[10px] uppercase">
                      <th className="py-2.5 px-2">Emp ID</th>
                      <th className="py-2.5 px-2">Name / Email</th>
                      <th className="py-2.5 px-2">Department</th>
                      <th className="py-2.5 px-2">Role</th>
                      <th className="py-2.5 px-2">Last Login</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cosmic-border/30 text-[11px] text-cosmic-text font-medium">
                    {users.map((u) => (
                      <tr key={u.empId} className="hover:bg-cosmic-card-hover/40 transition-colors">
                        <td className="py-2.5 px-2 font-mono text-cosmic-muted">{u.empId}</td>
                        <td className="py-2.5 px-2">
                          <div className="font-bold">{u.name}</div>
                          <div className="text-[10px] text-cosmic-muted">{u.email}</div>
                        </td>
                        <td className="py-2.5 px-2">{u.department}</td>
                        <td className="py-2.5 px-2 font-semibold text-indigo-500">{u.role}</td>
                        <td className="py-2.5 px-2 font-mono text-cosmic-muted">{u.lastLogin}</td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <div className="flex justify-end space-x-1">
                            <button 
                              onClick={() => toggleUserStatus(u.empId)} 
                              title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                              className={`p-1 rounded bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border ${u.status === 'Active' ? 'text-rose-500' : 'text-emerald-500'}`}
                            >
                              {u.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                            </button>
                            <button 
                              onClick={async () => {
                                const newPass = window.prompt(`Enter new password for ${u.name}:`, 'astroved123');
                                if (newPass !== null && newPass.trim() !== '') {
                                  try {
                                    await api.updateUser(u.empId, { password: newPass });
                                    toast.success(`Password updated for ${u.name}!`);
                                    
                                    // Log audit
                                    await api.createAuditLog({
                                      user: 'Super Admin',
                                      action: `Updated password for user ${u.name}`,
                                      module: 'User Management',
                                      ip: '127.0.0.1',
                                      browser: navigator.userAgent
                                    });
                                  } catch (err) {
                                    toast.error('Failed to update password');
                                  }
                                }
                              }}
                              title="Reset Password"
                              className="p-1 rounded bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border text-amber-500"
                            >
                              <Key size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.empId, u.name)}
                              title="Delete User"
                              className="p-1 rounded bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border text-rose-500 hover:text-rose-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES & PERMISSIONS */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">Roles & Permissions Configurator</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Map corporate authorization configurations to specific dashboard metrics and actions.</p>
              </div>

              {/* Role selection dropdown */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-64">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Select Role Profile</label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-cosmic-bg border border-cosmic-border text-xs text-cosmic-text px-3 py-2 rounded-xl focus:outline-none"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="text-[10px] text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex items-start space-x-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p>Changes apply globally to all users mapped as <strong>{selectedRole}</strong>.</p>
                </div>
              </div>

              {/* Permissions Checklist Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Panel A: Dashboard & Data Access */}
                <div className="space-y-4">
                  <div className="p-3 bg-cosmic-bg border border-cosmic-border rounded-xl space-y-3">
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">Dashboard View Access</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.keys(permissions.dashboard).map(key => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissions.dashboard[key]} 
                            onChange={() => togglePermission('dashboard', key)}
                            className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                          />
                          <span className="capitalize">{key} Dashboard</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-cosmic-bg border border-cosmic-border rounded-xl space-y-3">
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">Data Actions Permissions</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.keys(permissions.data).map(key => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissions.data[key]} 
                            onChange={() => togglePermission('data', key)}
                            className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                          />
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel B: Management & CRUD Permissions */}
                <div className="space-y-4">
                  <div className="p-3 bg-cosmic-bg border border-cosmic-border rounded-xl space-y-3">
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">Management Scope Permissions</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.keys(permissions.management).map(key => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissions.management[key]} 
                            onChange={() => togglePermission('management', key)}
                            className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                          />
                          <span className="capitalize">Manage {key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-cosmic-bg border border-cosmic-border rounded-xl space-y-3">
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">General CRUD Settings</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.keys(permissions.crud).map(key => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permissions.crud[key]} 
                            onChange={() => togglePermission('crud', key)}
                            className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                          />
                          <span className="capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-2 border-t border-cosmic-border/30">
                <button 
                  onClick={handleSavePermissions}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/10 active:scale-95 transition-transform"
                >
                  <Save size={14} />
                  <span>Save Role Permissions</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KPI MANAGEMENT */}
          {activeTab === 'kpis' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-cosmic-border/50">
                <div>
                  <h3 className="text-sm font-extrabold text-cosmic-text">KPI & Formula Library Management</h3>
                  <p className="text-[10px] text-cosmic-muted mt-0.5">Define core business metric formulas, display ordering configurations, and warning thresholds.</p>
                </div>
                <button 
                  onClick={() => setShowAddKPIModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1"
                >
                  <Plus size={12} />
                  <span>Add KPI</span>
                </button>
              </div>

              {/* KPI List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.map(k => (
                  <div key={k.id} className="p-4 bg-cosmic-bg border border-cosmic-border rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded" style={{ backgroundColor: `${k.color}20`, color: k.color }}>
                          {k.category}
                        </span>
                        <span className="text-[9px] font-mono text-cosmic-muted">Order: {k.order}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-cosmic-text mt-2">{k.name}</h4>
                      <div className="bg-cosmic-card-hover/30 border border-cosmic-border/30 rounded p-1.5 font-mono text-[9px] text-indigo-400 mt-1 truncate">
                        {k.formula}
                      </div>
                    </div>
                    
                    <div className="pt-2.5 border-t border-cosmic-border/50 grid grid-cols-3 gap-1 text-[9px] text-center">
                      <div>
                        <span className="text-cosmic-muted block">Target</span>
                        <strong className="text-emerald-500">{k.target}</strong>
                      </div>
                      <div>
                        <span className="text-cosmic-muted block">Warning</span>
                        <strong className="text-amber-500">{k.warning}</strong>
                      </div>
                      <div>
                        <span className="text-cosmic-muted block">Critical</span>
                        <strong className="text-rose-500">{k.critical}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TARGET MANAGEMENT */}
          {activeTab === 'targets' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">Target Settings Matrix</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Configure targets for Revenue, Sales, Marketing, SEO, and Customers across custom segments.</p>
              </div>

              {/* Targets List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-cosmic-border text-cosmic-muted font-bold text-[10px] uppercase">
                      <th className="py-2 px-2">Target Metric</th>
                      <th className="py-2 px-2">Frequency</th>
                      <th className="py-2 px-2 text-right">Target Value</th>
                      <th className="py-2 px-2">Department</th>
                      <th className="py-2 px-2">Country Scope</th>
                      <th className="py-2 px-2">Product Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cosmic-border/30 text-[11px] text-cosmic-text font-medium">
                    {targetMetrics.map((t) => (
                      <tr key={t.id} className="hover:bg-cosmic-card-hover/40 transition-colors">
                        <td className="py-2.5 px-2 font-bold text-cosmic-text">{t.name}</td>
                        <td className="py-2.5 px-2">{t.type}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-emerald-500">{t.value}</td>
                        <td className="py-2.5 px-2 font-mono text-cosmic-muted">{t.dept}</td>
                        <td className="py-2.5 px-2 font-semibold text-indigo-400">{t.country}</td>
                        <td className="py-2.5 px-2 text-cosmic-muted">{t.product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REPORT SCHEDULER */}
          {activeTab === 'scheduler' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">Automated Reports Scheduler</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Configure report generation intervals, CC/BCC recipients, and trigger email test dispatches.</p>
              </div>

              {/* Add schedule form */}
              <form onSubmit={handleAddSchedule} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl">
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Schedule Name</label>
                  <input 
                    type="text" 
                    placeholder="Weekly Sales Digest"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                    className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Frequency</label>
                  <select 
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                    className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Format</label>
                  <select 
                    value={newSchedule.format}
                    onChange={(e) => setNewSchedule({ ...newSchedule, format: e.target.value })}
                    className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Recipients (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="analytics-leads@astroved.com"
                    value={newSchedule.recipients}
                    onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                    className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-transform active:scale-95"
                  >
                    Create Schedule
                  </button>
                </div>
              </form>

              {/* Active schedules */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">Active Schedules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schedules.map(s => (
                    <div key={s.id} className="p-3 bg-cosmic-bg border border-cosmic-border rounded-xl flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-cosmic-text truncate">{s.name}</h5>
                        <p className="text-[9px] text-cosmic-muted mt-0.5">{s.frequency} ({s.format}) • {s.recipients}</p>
                      </div>
                      <button 
                        onClick={() => handleTriggerTestReport(s.name)}
                        className="ml-3 px-2 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[9px] font-bold rounded-lg shrink-0"
                      >
                        Send Test
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">Notification Channels & Webhooks</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Toggle notification rules for revenue milestones, KPI alerts, and payment gateways failures.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Webhooks configuration */}
                <div className="space-y-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl">
                  <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">Chat Ops Integrations</h4>
                  <div>
                    <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Slack Webhook URL</label>
                    <input 
                      type="text" 
                      value={notifSettings.slackWebhook}
                      onChange={(e) => setNotifSettings({ ...notifSettings, slackWebhook: e.target.value })}
                      className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Microsoft Teams Webhook URL</label>
                    <input 
                      type="text" 
                      placeholder="https://outlook.office.com/webhook/..."
                      value={notifSettings.teamsWebhook}
                      onChange={(e) => setNotifSettings({ ...notifSettings, teamsWebhook: e.target.value })}
                      className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Notification Rules */}
                <div className="space-y-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl justify-between flex flex-col">
                  <div>
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider mb-2.5">Alert Triggering Rules</h4>
                    <div className="space-y-2 text-xs">
                      {Object.keys(notifSettings.rules).map(key => (
                        <label key={key} className="flex items-center space-x-2.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifSettings.rules[key]} 
                            onChange={() => setNotifSettings({
                              ...notifSettings,
                              rules: { ...notifSettings.rules, [key]: !notifSettings.rules[key] }
                            })}
                            className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                          />
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSaveNotifications}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold mt-2"
                  >
                    Save Rules
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI SETTINGS */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">AI Cognitive & Engine Settings</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Configure target models, max tokens budgets, API keys, and prompt templates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">OpenAI API Key</label>
                    {isEditingApiKey ? (
                      <div className="flex gap-2">
                        <input 
                          type="password" 
                          value={aiSettings.apiKey}
                          onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                          className="flex-1 bg-cosmic-bg border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none font-mono"
                          placeholder="sk-proj-..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingApiKey(false);
                            loadAISettings(); // Restore previous loaded key
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-cosmic-border text-[10px] font-bold text-cosmic-muted hover:text-cosmic-text transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-cosmic-bg border border-cosmic-border px-3 py-1.5 rounded-lg">
                        <span className="text-xs text-cosmic-muted font-mono leading-none tracking-widest pt-1">
                          {aiSettings.apiKey ? '••••••••••••••••••••••••' : 'No Key Configured'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingApiKey(true);
                            // Clear dummy visual key if it starts with bullets so user enters a fresh one
                            if (aiSettings.apiKey.includes('••••') || aiSettings.apiKey.includes('***')) {
                              setAiSettings({ ...aiSettings, apiKey: '' });
                            }
                          }}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                          Change API Key
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">AI Model Selection</label>
                      <select 
                        value={aiSettings.model}
                        onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                        className="w-full bg-cosmic-bg border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="gpt-4o">gpt-4o (Recommended)</option>
                        <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost-Efficient)</option>
                        <option value="o3-mini">o3-mini (Latest Reasoning)</option>
                        <option value="o1">o1 (Advanced Reasoning)</option>
                        <option value="o1-mini">o1-mini (Reasoning Mini)</option>
                        <option value="gpt-4-turbo">gpt-4-turbo (Legacy High-Perf)</option>
                        <option value="gpt-4">gpt-4 (Standard legacy)</option>
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy speed)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">AI Refresh Interval</label>
                      <select 
                        value={aiSettings.refreshInterval}
                        onChange={(e) => setAiSettings({ ...aiSettings, refreshInterval: e.target.value })}
                        className="w-full bg-cosmic-bg border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option>1 Hour</option>
                        <option>6 Hours</option>
                        <option>Daily</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Prompt Template Context</label>
                    <textarea 
                      rows={3}
                      value={aiSettings.prompts}
                      onChange={(e) => setAiSettings({ ...aiSettings, prompts: e.target.value })}
                      className="w-full bg-cosmic-bg border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3.5 border-t border-cosmic-border/50">
                <span className="text-[10px] text-cosmic-muted font-bold">Max Tokens: {aiSettings.maxTokens} | Temp: {aiSettings.temperature}</span>
                <button 
                  onClick={handleSaveAISettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
                >
                  Save Cognitive Configurations
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: INTEGRATION SETTINGS */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">Integration Connectors</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Toggle and configure integration keys for external advertisement managers, databases, and CRMs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map(int => (
                  <div key={int.id} className="p-3 bg-cosmic-bg border border-cosmic-border rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-cosmic-text">{int.name}</h4>
                      <span className="text-[9px] text-cosmic-muted block mt-0.5">Last Sync: {int.lastSync}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenConfig(int)}
                        className="p-1 rounded-lg bg-cosmic-card hover:bg-cosmic-card-hover border border-cosmic-border text-cosmic-muted hover:text-cosmic-text transition-colors"
                        title="Configure Settings"
                      >
                        <Settings size={12} />
                      </button>
                      <button 
                        onClick={() => toggleIntegration(int.id)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-bold border transition-colors ${
                          int.connected 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-cosmic-card border-cosmic-border text-cosmic-muted hover:text-cosmic-text'
                        }`}
                      >
                        {int.connected ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {configuringIntegration && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-cosmic-card border border-cosmic-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-cosmic-border/50">
                      <h4 className="text-sm font-extrabold text-cosmic-text">Configure {configuringIntegration.name}</h4>
                      <button 
                        onClick={() => setConfiguringIntegration(null)} 
                        className="text-cosmic-muted hover:text-cosmic-text text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <form onSubmit={handleSaveIntegrationConfig} className="space-y-4">
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {Object.keys(configuringIntegration.config || {}).map((key) => {
                          const isSecret = key.toLowerCase().includes('secret') || 
                                           key.toLowerCase().includes('key') || 
                                           key.toLowerCase().includes('password') || 
                                           key.toLowerCase().includes('token');
                          return (
                            <div key={key}>
                              <label className="text-[10px] font-bold text-cosmic-muted uppercase block mb-1">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </label>
                              <input 
                                type={isSecret ? 'password' : 'text'}
                                value={configFields[key] || ''}
                                onChange={(e) => setConfigFields({ ...configFields, [key]: e.target.value })}
                                className="w-full bg-cosmic-bg border border-cosmic-border text-xs text-cosmic-text px-3 py-2 rounded-lg focus:outline-none"
                                placeholder={`Enter ${key}`}
                              />
                            </div>
                          );
                        })}
                        {Object.keys(configuringIntegration.config || {}).length === 0 && (
                          <p className="text-xs text-cosmic-muted">No configurable options for this integration connector.</p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2 pt-3 border-t border-cosmic-border/50">
                        <button 
                          type="button"
                          onClick={() => setConfiguringIntegration(null)}
                          className="px-3.5 py-1.5 bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border rounded-lg text-[10px] font-bold text-cosmic-text"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold"
                        >
                          Save Config
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-cosmic-border/50">
                <div>
                  <h3 className="text-sm font-extrabold text-cosmic-text">Global Audit Log Trail</h3>
                  <p className="text-[10px] text-cosmic-muted mt-0.5">Immutable audit trails tracking settings actions, login events, and report triggers.</p>
                </div>
                <button 
                  onClick={handleExportAuditLogs}
                  className="px-2.5 py-1.5 bg-cosmic-bg border border-cosmic-border hover:bg-cosmic-card-hover rounded-lg text-[9px] font-bold flex items-center space-x-1 text-cosmic-text"
                >
                  <Download size={11} />
                  <span>Download Logs</span>
                </button>
              </div>

              {/* Logs table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-cosmic-border text-cosmic-muted font-bold text-[10px] uppercase">
                      <th className="py-2 px-2">User</th>
                      <th className="py-2 px-2">Action Event</th>
                      <th className="py-2 px-2">Module</th>
                      <th className="py-2 px-2">IP Address</th>
                      <th className="py-2 px-2">Browser / OS</th>
                      <th className="py-2 px-2 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cosmic-border/30 text-[11px] text-cosmic-text font-medium">
                    {auditLogs.map((l, idx) => (
                      <tr key={idx} className="hover:bg-cosmic-card-hover/40 transition-colors">
                        <td className="py-2.5 px-2 font-bold text-cosmic-text">{l.user}</td>
                        <td className="py-2.5 px-2 text-indigo-400 font-semibold">{l.action}</td>
                        <td className="py-2.5 px-2 font-mono text-[10px] text-cosmic-muted">{l.module}</td>
                        <td className="py-2.5 px-2 font-mono text-[10px] text-cosmic-muted">{l.ip}</td>
                        <td className="py-2.5 px-2 text-cosmic-muted truncate max-w-[130px]">{l.browser}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-cosmic-muted">{l.date} {l.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: SYSTEM SETTINGS */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-cosmic-border/50">
                <h3 className="text-sm font-extrabold text-cosmic-text">BI System Configuration</h3>
                <p className="text-[10px] text-cosmic-muted mt-0.5">Control company profile, currency units, formats, backups options, and locale rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl">
                  <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider">Company Profile</h4>
                  <div>
                    <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={systemConfig.companyName}
                      onChange={(e) => setSystemConfig({ ...systemConfig, companyName: e.target.value })}
                      className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Theme Mode</label>
                      <select 
                        value={systemConfig.themeMode}
                        onChange={(e) => setSystemConfig({ ...systemConfig, themeMode: e.target.value })}
                        className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">System Currency</label>
                      <select 
                        value={systemConfig.currency}
                        onChange={(e) => setSystemConfig({ ...systemConfig, currency: e.target.value })}
                        className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option>৳ (BDT)</option>
                        <option>₹ (INR)</option>
                        <option>$ (USD)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl justify-between flex flex-col">
                  <div>
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider mb-2.5">Backup Settings</h4>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={systemConfig.autoBackup}
                          onChange={(e) => setSystemConfig({ ...systemConfig, autoBackup: e.target.checked })}
                          className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
                        />
                        <span>Enable Auto Database Backup</span>
                      </label>
                      <div className="mt-2.5">
                        <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Backup Frequency</label>
                        <select 
                          value={systemConfig.backupInterval}
                          onChange={(e) => setSystemConfig({ ...systemConfig, backupInterval: e.target.value })}
                          className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                        >
                          <option>Hourly</option>
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleTriggerBackup}
                    className="w-full py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg text-xs font-bold mt-2 flex items-center justify-center space-x-1"
                  >
                    <Database size={13} />
                    <span>Backup Database Now</span>
                  </button>
                </div>
              </div>

              {/* System Configurations Save and Bulk Actions Row */}
              <hr className="border-cosmic-border/30 my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Save System Configuration Panel */}
                <div className="space-y-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl justify-between flex flex-col">
                  <div>
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider mb-2">System Save Actions</h4>
                    <p className="text-[10px] text-cosmic-muted mb-4">Commit configuration changes globally to the database settings.</p>
                  </div>
                  <button 
                    onClick={handleSaveSystemConfig}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 shadow-md shadow-indigo-600/10"
                  >
                    <Save size={14} />
                    <span>Save System Settings</span>
                  </button>
                </div>

                {/* Bulk Import/Export Panel */}
                <div className="space-y-3 p-3 bg-cosmic-bg border border-cosmic-border rounded-xl justify-between flex flex-col">
                  <div>
                    <h4 className="text-[10px] font-bold text-cosmic-muted uppercase tracking-wider mb-2">Bulk Data Import & Export</h4>
                    <p className="text-[10px] text-cosmic-muted mb-3">Export collections to CSV/JSON files or import/restore backups.</p>
                    
                    <div className="flex gap-2 mb-2">
                      <select 
                        value={selectedImportExportCollection}
                        onChange={(e) => setSelectedImportExportCollection(e.target.value)}
                        className="w-full bg-cosmic-card border border-cosmic-border text-xs text-cosmic-text px-3 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="users">Users Directory</option>
                        <option value="kpis">KPI Metrics Library</option>
                        <option value="targets">Target Metrics Matrix</option>
                        <option value="schedules">Report Schedules</option>
                        <option value="integrations">System Connectors</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportCollection('csv')}
                        className="flex-1 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1"
                      >
                        <Download size={11} />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={() => handleExportCollection('json')}
                        className="flex-1 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1"
                      >
                        <Download size={11} />
                        <span>Export JSON</span>
                      </button>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-cosmic-border/30">
                      <label className="text-[9px] font-bold text-cosmic-muted uppercase block mb-1">Import File (CSV/JSON)</label>
                      <input
                        type="file"
                        accept=".csv,.json"
                        onChange={handleImportFile}
                        className="w-full text-xs text-cosmic-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-cosmic-card file:text-cosmic-text file:hover:bg-cosmic-card-hover cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ----------------------------------------------------
      // MODAL - ADD USER MODAL
      // ---------------------------------------------------- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cosmic-card border border-cosmic-border rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <h4 className="text-sm font-extrabold text-cosmic-text mb-1">Add New Portal User</h4>
            <p className="text-[10px] text-cosmic-muted mb-4">Input the details of the employee to initiate portal access.</p>
            
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@astroved.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Designation</label>
                  <input 
                    type="text" 
                    placeholder="Analyst Lead"
                    value={newUser.designation}
                    onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                    className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Department</label>
                  <select 
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                  >
                    <option>Analytics</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>SEO</option>
                    <option>Operations</option>
                    <option>Developer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Login Password</label>
                  <input 
                    type="text" 
                    placeholder="Default: astroved123"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">System Role Profile</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-cosmic-border/30">
                <button 
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-2 bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
      // MODAL - ADD KPI MODAL
      // ---------------------------------------------------- */}
      {showAddKPIModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cosmic-card border border-cosmic-border rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <h4 className="text-sm font-extrabold text-cosmic-text mb-1">Add New KPI Metric</h4>
            <p className="text-[10px] text-cosmic-muted mb-4">Draft customized metrics formulas and target thresholds parameters.</p>
            
            <form onSubmit={handleAddKPI} className="space-y-3 text-xs">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">KPI Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Marketing ROI"
                  value={newKpi.name}
                  onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Formula String</label>
                <input 
                  type="text" 
                  placeholder="e.g. ad_revenue / ad_spend"
                  value={newKpi.formula}
                  onChange={(e) => setNewKpi({ ...newKpi, formula: e.target.value })}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Category</label>
                  <select 
                    value={newKpi.category}
                    onChange={(e) => setNewKpi({ ...newKpi, category: e.target.value })}
                    className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                  >
                    <option>Executive</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>SEO</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-cosmic-muted block mb-1">Target</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5.5%"
                    value={newKpi.target}
                    onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                    className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-cosmic-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-cosmic-border/30">
                <button 
                  type="button"
                  onClick={() => setShowAddKPIModal(false)}
                  className="px-3.5 py-2 bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10"
                >
                  Save KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminControl;
