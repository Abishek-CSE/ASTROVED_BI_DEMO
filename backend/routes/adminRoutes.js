import express from 'express';
import {
  exportCollection,
  importCollection,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  updateRole,
  getKPIs,
  createKPI,
  deleteKPI,
  getTargets,
  createTarget,
  getSchedules,
  createSchedule,
  deleteSchedule,
  getNotifications,
  updateNotifications,
  getAISettings,
  updateAISettings,
  generateAIInsights,
  getIntegrations,
  toggleIntegration,
  updateIntegrationConfig,
  getAuditLogs,
  createAuditLog,
  getSystemConfig,
  updateSystemConfig
} from '../controllers/adminController.js';

const router = express.Router();

// Import / Export
router.get('/export/:collection', exportCollection);
router.post('/import/:collection', importCollection);

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:empId', updateUser);
router.delete('/users/:empId', deleteUser);

// Roles
router.get('/roles', getRoles);
router.put('/roles/:role', updateRole);

// KPIs
router.get('/kpis', getKPIs);
router.post('/kpis', createKPI);
router.delete('/kpis/:id', deleteKPI);

// Targets
router.get('/targets', getTargets);
router.post('/targets', createTarget);

// Schedules
router.get('/schedules', getSchedules);
router.post('/schedules', createSchedule);
router.delete('/schedules/:id', deleteSchedule);

// Notifications
router.get('/notifications', getNotifications);
router.post('/notifications', updateNotifications);

// AI Settings
router.get('/ai', getAISettings);
router.post('/ai', updateAISettings);
router.post('/ai/insights', generateAIInsights);

// Integrations
router.get('/integrations', getIntegrations);
router.patch('/integrations/:id', toggleIntegration);
router.put('/integrations/:id', updateIntegrationConfig);

// Audit Logs
router.get('/audit', getAuditLogs);
router.post('/audit', createAuditLog);

// System Config
router.get('/system', getSystemConfig);
router.post('/system', updateSystemConfig);

export default router;
