import User from '../models/User.js';
import RolePermission from '../models/RolePermission.js';
import KPI from '../models/KPI.js';
import TargetMetric from '../models/TargetMetric.js';
import ReportSchedule from '../models/ReportSchedule.js';
import NotificationSetting from '../models/NotificationSetting.js';
import AISetting from '../models/AISetting.js';
import Integration from '../models/Integration.js';
import AuditLog from '../models/AuditLog.js';
import SystemConfig from '../models/SystemConfig.js';

// Map collection name to Model
const getModel = (name) => {
  const models = {
    users: User,
    roles: RolePermission,
    kpis: KPI,
    targets: TargetMetric,
    schedules: ReportSchedule,
    notifications: NotificationSetting,
    ai: AISetting,
    integrations: Integration,
    audit: AuditLog,
    system: SystemConfig
  };
  return models[name.toLowerCase()];
};

// JSON to CSV converter
const convertToCSV = (objArray) => {
  if (!objArray || !objArray.length) return '';
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  
  // Get all keys (headers) excluding Mongoose internal fields
  const sample = array[0].toObject ? array[0].toObject() : array[0];
  const headers = Object.keys(sample).filter(k => k !== '_id' && k !== '__v');
  let str = headers.join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    const item = array[i].toObject ? array[i].toObject() : array[i];
    for (let index in headers) {
      const head = headers[index];
      let val = item[head];
      if (val === undefined || val === null) {
        val = '';
      } else if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      
      // Escape quotes and wrap in quotes if commas/quotes/newlines exist
      let valStr = String(val).replace(/"/g, '""');
      if (valStr.includes(',') || valStr.includes('\n') || valStr.includes('"')) {
        valStr = `"${valStr}"`;
      }
      line += valStr + (index < headers.length - 1 ? ',' : '');
    }
    str += line + '\r\n';
  }
  return str;
};

// CSV to JSON Parser
const parseCSV = (csvText) => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  
  // Parse header line
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = [];
    let insideQuote = false;
    let entry = '';
    
    for (let char of line) {
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(entry.trim().replace(/^"|"$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    values.push(entry.trim().replace(/^"|"$/g, ''));

    const obj = {};
    headers.forEach((header, index) => {
      let val = values[index] !== undefined ? values[index] : '';
      // Parse nested objects if applicable
      if (val.startsWith('{') && val.endsWith('}')) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      // Parse booleans and numbers
      if (typeof val === 'string') {
        if (val.toLowerCase() === 'true') val = true;
        else if (val.toLowerCase() === 'false') val = false;
        else if (!isNaN(val) && val !== '') val = Number(val);
      }
      obj[header] = val;
    });
    result.push(obj);
  }
  return result;
};

// Export Controller
export const exportCollection = async (req, res) => {
  try {
    const { collection } = req.params;
    const format = req.query.format || 'csv';
    const Model = getModel(collection);
    
    if (!Model) {
      return res.status(400).json({ message: `Invalid collection: ${collection}` });
    }

    const data = await Model.find({});
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=astroved_${collection}.json`);
      return res.send(JSON.stringify(data, null, 2));
    } else {
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=astroved_${collection}.csv`);
      return res.send(csv);
    }
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
};

// Import Controller
export const importCollection = async (req, res) => {
  try {
    const { collection } = req.params;
    const { format, data } = req.body;
    const Model = getModel(collection);

    if (!Model) {
      return res.status(400).json({ message: `Invalid collection: ${collection}` });
    }

    let parsedData = [];
    if (format === 'json') {
      parsedData = Array.isArray(data) ? data : [data];
    } else if (format === 'csv') {
      parsedData = parseCSV(data);
    } else {
      return res.status(400).json({ message: 'Invalid format. Use json or csv.' });
    }

    if (!parsedData.length) {
      return res.status(400).json({ message: 'No records found to import' });
    }

    // Custom upsert logic depending on model primary keys
    const upsertPromises = parsedData.map(async (item) => {
      // Remove Mongoose properties if present in imported file
      delete item._id;
      delete item.__v;

      if (collection === 'users' && item.empId) {
        return Model.findOneAndUpdate({ empId: item.empId }, item, { upsert: true, new: true });
      } else if (collection === 'roles' && item.role) {
        return Model.findOneAndUpdate({ role: item.role }, item, { upsert: true, new: true });
      } else if (collection === 'kpis' && item.id !== undefined) {
        return Model.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
      } else if (collection === 'targets' && item.id !== undefined) {
        return Model.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
      } else if (collection === 'schedules' && item.id !== undefined) {
        return Model.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
      } else if (collection === 'integrations' && item.id !== undefined) {
        return Model.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
      } else {
        // Fallback for models without unique keys like audit logs, configurations
        return Model.create(item);
      }
    });

    await Promise.all(upsertPromises);
    
    // Log audit trail
    await AuditLog.create({
      user: 'Super Admin',
      action: `Imported ${parsedData.length} records into ${collection}`,
      module: 'Data Import/Export',
      ip: req.ip || '127.0.0.1',
      browser: req.headers['user-agent'] || 'API Client',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0]
    });

    res.json({ message: `Successfully imported ${parsedData.length} records into ${collection}` });
  } catch (error) {
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

// --- CRUD Controllers ---

// Users CRUD
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { empId } = req.params;
    const user = await User.findOneAndUpdate({ empId }, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { empId } = req.params;
    const user = await User.findOneAndDelete({ empId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Roles CRUD
export const getRoles = async (req, res) => {
  try {
    const roles = await RolePermission.find({});
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role } = req.params;
    const rolePermission = await RolePermission.findOneAndUpdate(
      { role },
      { permissions: req.body.permissions },
      { new: true, upsert: true }
    );
    res.json(rolePermission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// KPIs CRUD
export const getKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find({}).sort({ order: 1 });
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createKPI = async (req, res) => {
  try {
    // Generate simple incremental ID
    const lastKPI = await KPI.findOne().sort({ id: -1 });
    const nextId = lastKPI ? lastKPI.id + 1 : 1;
    const kpi = new KPI({ ...req.body, id: nextId });
    await kpi.save();
    res.status(201).json(kpi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteKPI = async (req, res) => {
  try {
    const { id } = req.params;
    const kpi = await KPI.findOneAndDelete({ id: Number(id) });
    if (!kpi) return res.status(404).json({ message: 'KPI not found' });
    res.json({ message: 'KPI deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Targets CRUD
export const getTargets = async (req, res) => {
  try {
    const targets = await TargetMetric.find({});
    res.json(targets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTarget = async (req, res) => {
  try {
    const lastTarget = await TargetMetric.findOne().sort({ id: -1 });
    const nextId = lastTarget ? lastTarget.id + 1 : 1;
    const target = new TargetMetric({ ...req.body, id: nextId });
    await target.save();
    res.status(201).json(target);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Schedules CRUD
export const getSchedules = async (req, res) => {
  try {
    const schedules = await ReportSchedule.find({});
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const lastSchedule = await ReportSchedule.findOne().sort({ id: -1 });
    const nextId = lastSchedule ? lastSchedule.id + 1 : 1;
    const schedule = new ReportSchedule({ ...req.body, id: nextId });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await ReportSchedule.findOneAndDelete({ id: Number(id) });
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Notifications Settings
export const getNotifications = async (req, res) => {
  try {
    let settings = await NotificationSetting.findOne({});
    if (!settings) {
      settings = await NotificationSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotifications = async (req, res) => {
  try {
    const settings = await NotificationSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// AI Settings
export const getAISettings = async (req, res) => {
  try {
    let settings = await AISetting.findOne({});
    if (!settings) {
      settings = await AISetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAISettings = async (req, res) => {
  try {
    const settings = await AISetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Integrations
export const getIntegrations = async (req, res) => {
  try {
    const integrations = await Integration.find({});
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const integration = await Integration.findOne({ id });
    if (!integration) return res.status(404).json({ message: 'Integration not found' });
    
    integration.connected = !integration.connected;
    integration.lastSync = integration.connected ? 'Just now' : 'Never';
    await integration.save();
    
    res.json(integration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateIntegrationConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { config } = req.body;
    const integration = await Integration.findOne({ id });
    if (!integration) return res.status(404).json({ message: 'Integration not found' });
    
    integration.config = config;
    integration.connected = true;
    integration.lastSync = 'Just now';
    await integration.save();
    
    res.json(integration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Audit Logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAuditLog = async (req, res) => {
  try {
    const log = new AuditLog({
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0],
      time: req.body.time || new Date().toTimeString().split(' ')[0]
    });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// System Configurations
export const getSystemConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne({});
    if (!config) {
      config = await SystemConfig.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSystemConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
