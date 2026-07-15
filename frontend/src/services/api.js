const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth
  login: (email, password) => fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handleResponse),

  // Users
  getUsers: () => fetch('/api/admin/users').then(handleResponse),
  createUser: (user) => fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(handleResponse),
  updateUser: (empId, updates) => fetch(`/api/admin/users/${empId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  }).then(handleResponse),
  deleteUser: (empId) => fetch(`/api/admin/users/${empId}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Roles
  getRoles: () => fetch('/api/admin/roles').then(handleResponse),
  updateRole: (role, permissions) => fetch(`/api/admin/roles/${role}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permissions })
  }).then(handleResponse),

  // KPIs
  getKPIs: () => fetch('/api/admin/kpis').then(handleResponse),
  createKPI: (kpi) => fetch('/api/admin/kpis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kpi)
  }).then(handleResponse),
  deleteKPI: (id) => fetch(`/api/admin/kpis/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Targets
  getTargets: () => fetch('/api/admin/targets').then(handleResponse),
  createTarget: (target) => fetch('/api/admin/targets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(target)
  }).then(handleResponse),

  // Schedules
  getSchedules: () => fetch('/api/admin/schedules').then(handleResponse),
  createSchedule: (schedule) => fetch('/api/admin/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule)
  }).then(handleResponse),
  deleteSchedule: (id) => fetch(`/api/admin/schedules/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),

  // Notifications
  getNotifications: () => fetch('/api/admin/notifications').then(handleResponse),
  updateNotifications: (settings) => fetch('/api/admin/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  }).then(handleResponse),

  // AI Settings
  getAISettings: () => fetch('/api/admin/ai').then(handleResponse),
  updateAISettings: (settings) => fetch('/api/admin/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  }).then(handleResponse),
  generateAIInsights: () => fetch('/api/admin/ai/insights', {
    method: 'POST'
  }).then(handleResponse),

  // Integrations
  getIntegrations: () => fetch('/api/admin/integrations').then(handleResponse),
  toggleIntegration: (id) => fetch(`/api/admin/integrations/${id}`, {
    method: 'PATCH'
  }).then(handleResponse),
  updateIntegrationConfig: (id, config) => fetch(`/api/admin/integrations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config })
  }).then(handleResponse),

  // Audit Logs
  getAuditLogs: () => fetch('/api/admin/audit').then(handleResponse),
  createAuditLog: (log) => fetch('/api/admin/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(log)
  }).then(handleResponse),

  // System Config
  getSystemConfig: () => fetch('/api/admin/system').then(handleResponse),
  updateSystemConfig: (config) => fetch('/api/admin/system', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  }).then(handleResponse),

  // Import / Export
  exportCollectionUrl: (collection, format = 'csv') => `/api/admin/export/${collection}?format=${format}`,
  importCollection: (collection, format, data) => fetch(`/api/admin/import/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, data })
  }).then(handleResponse)
};
