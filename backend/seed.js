import User from './models/User.js';
import RolePermission from './models/RolePermission.js';
import KPI from './models/KPI.js';
import TargetMetric from './models/TargetMetric.js';
import ReportSchedule from './models/ReportSchedule.js';
import NotificationSetting from './models/NotificationSetting.js';
import AISetting from './models/AISetting.js';
import Integration from './models/Integration.js';
import AuditLog from './models/AuditLog.js';
import SystemConfig from './models/SystemConfig.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed/Upsert Users
    const defaultUsers = [
      { empId: 'EMP001', name: 'System Admin', email: 'admin@astroved.com', password: 'admin123', phone: '+91 98765 43200', department: 'Analytics', designation: 'Super Admin', role: 'Super Admin', status: 'Active', createdDate: '2025-01-01', lastLogin: '2026-07-14 16:30' },

    ];
    for (const u of defaultUsers) {
      await User.findOneAndUpdate({ empId: u.empId }, u, { upsert: true, new: true });
    }
    console.log('Seeded/updated default users.');

    // 2. Seed/Upsert RolePermissions
    const defaultRoles = [
      {
        role: 'Super Admin',
        permissions: {
          dashboard: { executive: true, sales: true, marketing: true, seo: true, customer: true, funnel: true, operations: true, ai: true },
          data: { view: true, export: true, download: true, drillDown: true, viewCost: true, viewRevenue: true, viewProfit: true, viewCustomer: true },
          management: { users: true, roles: true, kpis: true, targets: true, reports: true, ai: true, notifications: true, integrations: true, apis: true },
          crud: { view: true, create: true, edit: true, delete: true, approve: true, publish: true }
        }
      },
      {
        role: 'Analyst',
        permissions: {
          dashboard: { executive: true, sales: true, marketing: false, seo: false, customer: true, funnel: false, operations: false, ai: true },
          data: { view: true, export: false, download: true, drillDown: true, viewCost: false, viewRevenue: true, viewProfit: false, viewCustomer: false },
          management: { users: false, roles: false, kpis: false, targets: false, reports: true, ai: false, notifications: false, integrations: false, apis: false },
          crud: { view: true, create: false, edit: false, delete: false, approve: false, publish: false }
        }
      },
      {
        role: 'Admin',
        permissions: {
          dashboard: { executive: true, sales: true, marketing: true, seo: true, customer: true, funnel: true, operations: true, ai: true },
          data: { view: true, export: true, download: true, drillDown: true, viewCost: true, viewRevenue: true, viewProfit: true, viewCustomer: true },
          management: { users: true, roles: false, kpis: true, targets: true, reports: true, ai: true, notifications: true, integrations: true, apis: true },
          crud: { view: true, create: true, edit: true, delete: false, approve: true, publish: true }
        }
      }
    ];
    for (const r of defaultRoles) {
      await RolePermission.findOneAndUpdate({ role: r.role }, r, { upsert: true, new: true });
    }
    console.log('Seeded/updated default role permissions.');

    // 3. Seed KPIs
    const kpiCount = await KPI.countDocuments();
    if (kpiCount === 0) {
      await KPI.insertMany([
        { id: 1, name: 'Daily Revenue', category: 'Executive', formula: 'SUM(daily_sales)', order: 1, color: '#6366f1', target: '₹10,00,000', warning: '₹8,00,000', critical: '₹5,00,000' },
        { id: 2, name: 'Conversion Rate', category: 'Sales', formula: 'completed_orders / total_visitors * 100', order: 2, color: '#06b6d4', target: '3.5%', warning: '3.0%', critical: '2.0%' },
        { id: 3, name: 'Google Ads ROAS', category: 'Marketing', formula: 'google_ads_revenue / google_ads_spend', order: 3, color: '#10b981', target: '4.5x', warning: '4.0x', critical: '3.0x' }
      ]);
      console.log('Seeded default KPIs.');
    }

    // 4. Seed TargetMetrics
    const targetCount = await TargetMetric.countDocuments();
    if (targetCount === 0) {
      await TargetMetric.insertMany([
        { id: 1, name: 'Revenue Target', type: 'Monthly', value: '₹5,00,00,000', dept: 'All', country: 'All', product: 'All' },
        { id: 2, name: 'Sales Conversion', type: 'Quarterly', value: '4.2%', dept: 'Sales', country: 'India', product: 'Puja Services' },
        { id: 3, name: 'Marketing ROI', type: 'Annual', value: '5.0x', dept: 'Marketing', country: 'USA', product: 'All' }
      ]);
      console.log('Seeded default target metrics.');
    }

    // 5. Seed ReportSchedules
    const scheduleCount = await ReportSchedule.countDocuments();
    if (scheduleCount === 0) {
      await ReportSchedule.insertMany([
        { id: 1, name: 'Daily Executive Digest', frequency: 'Daily', format: 'PDF', recipients: 'exec-list@astroved.com', timeZone: 'GMT+5:30' },
        { id: 2, name: 'Weekly Marketing Analytics', frequency: 'Weekly', format: 'Excel', recipients: 'marketing-team@astroved.com', timeZone: 'GMT+5:30' }
      ]);
      console.log('Seeded default report schedules.');
    }

    // 6. Seed NotificationSettings
    const notifCount = await NotificationSetting.countDocuments();
    if (notifCount === 0) {
      await NotificationSetting.create({
        emailNotif: true,
        dashboardAlerts: true,
        slackWebhook: 'https://hooks.slack.com/services/SLACK_MOCK_WEBHOOK_URL',
        teamsWebhook: '',
        rules: { revenueAlerts: true, kpiAlerts: true, failedPaymentAlerts: true, aiInsightAlerts: false }
      });
      console.log('Seeded default notification settings.');
    }

    // 7. Seed AISettings
    const aiCount = await AISetting.countDocuments();
    if (aiCount === 0) {
      await AISetting.create({
        apiKey: 'sk-proj-••••••••••••••••••••••••',
        model: 'gpt-4o',
        refreshInterval: '6 Hours',
        maxTokens: 2048,
        temperature: 0.7,
        enabled: true,
        prompts: 'Analyze AstroVed dashboard anomalies and draft immediate strategic interventions.'
      });
      console.log('Seeded default AI settings.');
    }

    // 8. Seed Integrations
    const integrationCount = await Integration.countDocuments();
    if (integrationCount === 0) {
      await Integration.insertMany([
        {
          id: 'google-analytics',
          name: 'Google Analytics (GA4)',
          connected: true,
          lastSync: '10 min ago',
          config: {
            measurementId: 'G-MOCKMEASURE12',
            apiSecret: 'mock_ga4_secret_key_12345'
          }
        },
        {
          id: 'google-search-console',
          name: 'Google Search Console',
          connected: true,
          lastSync: '1 hour ago',
          config: {
            siteUrl: 'https://www.astroved.com',
            clientEmail: 'gsc-sync@astroved.iam.gserviceaccount.com',
            privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...\n-----END PRIVATE KEY-----'
          }
        },
        {
          id: 'meta-ads',
          name: 'Meta Ads Manager',
          connected: false,
          lastSync: 'Never',
          config: {
            pixelId: '123456789012345',
            accessToken: 'mock_meta_ads_long_lived_token_xyz'
          }
        },
        {
          id: 'google-ads',
          name: 'Google Ads',
          connected: true,
          lastSync: '30 min ago',
          config: {
            developerToken: 'mock_dev_token_9876',
            customerId: '123-456-7890',
            clientId: 'mock_google_ads_client_id.apps.googleusercontent.com',
            clientSecret: 'mock_google_ads_client_secret_654321'
          }
        },
        {
          id: 'crm',
          name: 'Salesforce CRM',
          connected: false,
          lastSync: 'Never',
          config: {
            apiUrl: 'https://astroved.my.salesforce.com',
            username: 'integration-admin@astroved.com',
            password: 'mock_salesforce_password_123',
            securityToken: 'mock_salesforce_security_token_abc'
          }
        },
        {
          id: 'payment-gateway',
          name: 'Razorpay / Stripe',
          connected: true,
          lastSync: 'Real-time',
          config: {
            stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
            razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
            razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || ''
          }
        },
        {
          id: 'sql-database',
          name: 'BigQuery / PostgreSQL',
          connected: true,
          lastSync: '15 min ago',
          config: {
            host: 'localhost',
            port: '5432',
            database: 'astroved_bi',
            username: 'astroved_readonly',
            password: 'mock_db_password_456'
          }
        }
      ]);
      console.log('Seeded default integrations.');
    }

    // 9. Seed AuditLogs
    const logCount = await AuditLog.countDocuments();
    if (logCount === 0) {
      await AuditLog.insertMany([
        { user: 'Abishek R', action: 'User Login', module: 'Auth', ip: '192.168.1.15', browser: 'Chrome / Windows', date: '2026-07-14', time: '16:30:15' },
        { user: 'Abishek R', action: 'Update KPI target', module: 'KPI Settings', ip: '192.168.1.15', browser: 'Chrome / Windows', date: '2026-07-14', time: '16:10:45' },
        { user: 'Srinivasan K', action: 'Report Download', module: 'Reports Scheduler', ip: '192.168.10.84', browser: 'Safari / macOS', date: '2026-07-14', time: '15:48:22' },
        { user: 'System', action: 'AI Anomalies Generated', module: 'AI Engine', ip: 'Localhost', browser: 'Daemon Process', date: '2026-07-14', time: '12:00:00' }
      ]);
      console.log('Seeded default audit logs.');
    }

    // 10. Seed SystemConfig
    const systemCount = await SystemConfig.countDocuments();
    if (systemCount === 0) {
      await SystemConfig.create({
        companyName: 'AstroVed Business Solutions',
        logoUrl: 'https://cdn.astroved.com/images/images-av/AstroVed-Logo.svg',
        themeMode: 'light',
        currency: '₹ (INR)',
        timeZone: 'GMT+5:30 (IST)',
        fiscalYear: 'April - March',
        dateFormat: 'DD-MM-YYYY',
        language: 'English (US)',
        autoBackup: true,
        backupInterval: 'Daily'
      });
      console.log('Seeded default system configurations.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
