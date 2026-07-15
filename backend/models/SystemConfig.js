import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
  companyName: { type: String, default: 'AstroVed Business Solutions' },
  logoUrl: { type: String, default: 'https://cdn.astroved.com/images/images-av/AstroVed-Logo.svg' },
  themeMode: { type: String, default: 'light' },
  currency: { type: String, default: '₹ (INR)' },
  timeZone: { type: String, default: 'GMT+5:30 (IST)' },
  fiscalYear: { type: String, default: 'April - March' },
  dateFormat: { type: String, default: 'DD-MM-YYYY' },
  language: { type: String, default: 'English (US)' },
  autoBackup: { type: Boolean, default: true },
  backupInterval: { type: String, default: 'Daily' }
});

export default mongoose.model('SystemConfig', SystemConfigSchema);
