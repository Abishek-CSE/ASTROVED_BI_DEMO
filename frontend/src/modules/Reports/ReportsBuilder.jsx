import React, { useState, useEffect } from 'react';
import { Download, Calendar, Mail, CheckCircle2, Loader2, File } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const ReportsBuilder = () => {
  const [reportType, setReportType] = useState('daily');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  
  // Scheduler state
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleType, setScheduleType] = useState('weekly');
  const [recipients, setRecipients] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [schedules, setSchedules] = useState([]);

  const loadSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setExportStatus('Compiling dataset metrics...');
    
    // Map reportType to a collection in MongoDB
    const collectionMap = {
      daily: 'users',
      weekly: 'kpis',
      monthly: 'targets',
      quarterly: 'schedules',
      yearly: 'audit'
    };
    const collection = collectionMap[reportType] || 'users';
    
    setTimeout(() => {
      setExportStatus('Formatting into final schemas...');
      setTimeout(async () => {
        setIsExporting(false);
        setExportStatus('');
        
        try {
          // Trigger actual file download from the backend
          const url = api.exportCollectionUrl(collection, exportFormat === 'excel' ? 'csv' : exportFormat);
          const link = document.createElement('a');
          link.href = url;
          link.download = `astroved_${reportType}_report_${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'csv' : exportFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`Exported ${reportType} report successfully!`);
          
          // Log audit log
          await api.createAuditLog({
            user: 'Super Admin',
            action: `Generated and exported ${reportType} report`,
            module: 'Data Exporter',
            ip: '127.0.0.1',
            browser: navigator.userAgent
          });
        } catch (err) {
          toast.error('Export failed');
        }
      }, 1000);
    }, 1200);
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleName || !recipients) return;
    
    try {
      const newSch = {
        name: scheduleName,
        frequency: scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1),
        recipients,
        format: exportFormat.toUpperCase()
      };
      await api.createSchedule(newSch);
      toast.success('Schedule registered successfully!');
      loadSchedules();
      
      // Log audit log
      await api.createAuditLog({
        user: 'Super Admin',
        action: `Registered schedule: ${scheduleName}`,
        module: 'Reports Scheduler',
        ip: '127.0.0.1',
        browser: navigator.userAgent
      });
      
      setScheduleName('');
      setRecipients('');
    } catch (err) {
      toast.error('Failed to register schedule');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Export & Scheduler Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Export Form */}
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl space-y-6">
          <div>
            <h4 className="text-cosmic-text font-bold text-base flex items-center">
              <Download size={18} className="text-indigo-400 mr-2" />
              On-Demand Report Exporter
            </h4>
            <p className="text-xs text-cosmic-muted mt-1">
              Select variables below to assemble and download business intelligence records.
            </p>
          </div>

          <div className="space-y-4">
            {/* Report Type selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cosmic-text">Report Type</label>
              <div className="grid grid-cols-5 gap-2">
                {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setReportType(t)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-semibold uppercase border transition-colors ${
                      reportType === t
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-cosmic-bg border-cosmic-border text-cosmic-muted hover:text-cosmic-text'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cosmic-text">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['excel', 'pdf', 'csv'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setExportFormat(f)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold uppercase border transition-colors ${
                      exportFormat === f
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-cosmic-bg border-cosmic-border text-cosmic-muted hover:text-cosmic-text'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-md shadow-indigo-600/10"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{exportStatus}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Generate & Export Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Schedule Creator */}
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <h4 className="text-cosmic-text font-bold text-base flex items-center mb-1">
            <Calendar size={18} className="text-cosmic-accent mr-2" />
            Automated Report Scheduler
          </h4>
          <p className="text-xs text-cosmic-muted mb-4">
            Schedule recurring exports directly to email addresses.
          </p>

          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cosmic-text">Schedule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly KPI PDF summary"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-xs text-cosmic-text placeholder-cosmic-muted focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cosmic-text">Recurrence</label>
                <select
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-xs text-cosmic-text focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="daily">Every Day</option>
                  <option value="weekly">Every Week</option>
                  <option value="monthly">Every Month</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cosmic-text">Recipients Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-xs text-cosmic-text placeholder-cosmic-muted focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cosmic-text">Send Hour (UTC)</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-cosmic-bg border border-cosmic-border px-3 py-2 rounded-xl text-xs text-cosmic-text focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cosmic-bg hover:bg-cosmic-card-hover border border-cosmic-border text-cosmic-text text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
            >
              <Calendar size={14} className="text-cosmic-accent" />
              <span>Register Schedule</span>
            </button>
          </form>
        </div>

      </div>

      {/* Schedules List */}
      <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
        <h4 className="text-cosmic-text font-semibold text-sm mb-4 flex items-center">
          <Mail size={16} className="text-indigo-400 mr-1.5" />
          Active Report Deliveries
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cosmic-border text-cosmic-muted font-medium">
                <th className="py-2.5 pl-4">Schedule Description</th>
                <th className="py-2.5">Interval</th>
                <th className="py-2.5">Time</th>
                <th className="py-2.5 uppercase">Format</th>
                <th className="py-2.5">Recipients List</th>
                <th className="py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-border/30 text-cosmic-text">
              {schedules.map((sch, idx) => (
                <tr key={idx} className="hover:bg-cosmic-card-hover transition-colors">
                  <td className="py-3 pl-4 font-medium">{sch.name}</td>
                  <td className="py-3 font-semibold text-indigo-400 capitalize">{sch.frequency || sch.type}</td>
                  <td className="py-3 font-mono text-cosmic-muted">{sch.time || '09:00'}</td>
                  <td className="py-3 font-bold text-cyan-400 uppercase">{sch.format}</td>
                  <td className="py-3 font-mono text-cosmic-muted">{sch.recipients}</td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 size={10} className="mr-1" />
                      {sch.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsBuilder;
