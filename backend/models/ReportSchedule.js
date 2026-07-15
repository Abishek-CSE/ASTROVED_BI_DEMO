import mongoose from 'mongoose';

const ReportScheduleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  frequency: { type: String, required: true },
  format: { type: String, required: true },
  recipients: { type: String, required: true },
  timeZone: { type: String, default: 'GMT+5:30' }
});

export default mongoose.model('ReportSchedule', ReportScheduleSchema);
