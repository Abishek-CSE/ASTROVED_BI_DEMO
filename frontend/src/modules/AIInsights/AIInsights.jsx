import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../../services/mockData';
import { useDateFilter } from '../../contexts/DateFilterContext';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  Sparkles, TrendingUp, TrendingDown, AlertTriangle,
  ArrowRight, Play, Loader2, ShieldAlert, Cpu
} from 'lucide-react';

const AIInsights = ({ setCurrentModule }) => {
  const { startDate, endDate } = useDateFilter();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load mock insights on initial load or date filter changes
  useEffect(() => {
    setInsights(getAIInsights(startDate, endDate));
    setError('');
  }, [startDate, endDate]);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError('');
    const loadToast = toast.loading('Consulting AI Engine & analyzing metrics...');

    try {
      const data = await api.generateAIInsights();
      setInsights(data);
      toast.success('Live AI Insights generated successfully!', { id: loadToast });
    } catch (err) {
      const errMsg = err.message || 'Failed to generate insights';
      setError(errMsg);
      toast.error(errMsg, { id: loadToast });
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-cosmic-card/45 border border-cosmic-border/50 p-6 rounded-2xl relative overflow-hidden animate-pulse">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-cosmic-border/40 shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-cosmic-border/40 rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-3 bg-cosmic-border/30 rounded w-3/4" />
                <div className="h-3 bg-cosmic-border/30 rounded w-1/2" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-10 bg-cosmic-border/20 rounded-xl w-full" />
                <div className="h-10 bg-cosmic-border/20 rounded-xl w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/10 to-transparent">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="animate-pulse" size={24} />
          </div>
          <div>
            <h3 className="text-cosmic-text font-bold text-lg">AI-Driven Business Intelligence Insights</h3>
            <p className="text-xs text-cosmic-muted mt-0.5">
              Automatically scanning operations, traffic performance, and purchase trends to identify anomalies, causes, and actionable recommendations.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateInsights}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 cursor-pointer w-full md:w-auto shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Analyzing Dashboard...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Live AI Insights</span>
            </>
          )}
        </button>
      </div>

      {/* Error / API Key Missing Warning Banner */}
      {error && (
        <div className="bg-rose-500/5 border border-rose-500/15 p-5 rounded-2xl flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-cosmic-text">OpenAI API Connection Needed</h4>
            <p className="text-xs text-cosmic-muted mt-1.5 leading-relaxed">
              {error}
            </p>
            {error.toLowerCase().includes('api key') && setCurrentModule && (
              <button
                onClick={() => setCurrentModule('ai-settings')}
                className="mt-3 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cosmic-card border border-cosmic-border hover:bg-cosmic-card-hover text-cosmic-text text-[11px] font-bold transition-all cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Go to AI Settings Panel</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Insights Panel */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-6">
          {insights.map((insight) => {
            const isIncrease = insight.type === 'increase';
            const isDrop = insight.type === 'drop';

            return (
              <div
                key={insight.id}
                className={`bg-cosmic-card border border-cosmic-border p-6 rounded-2xl border-l-4 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-black/5 ${isIncrease
                    ? 'border-l-cosmic-success bg-gradient-to-r from-emerald-500/5 to-transparent'
                    : isDrop
                      ? 'border-l-cosmic-danger bg-gradient-to-r from-rose-500/5 to-transparent'
                      : 'border-l-cosmic-accent bg-gradient-to-r from-amber-500/5 to-transparent'
                  }`}
              >
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">

                  {/* Text Content */}
                  <div className="space-y-4 flex-1">
                    {/* Badge & Title */}
                    <div className="flex items-center space-x-2">
                      {isIncrease ? (
                        <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <TrendingUp size={15} />
                        </span>
                      ) : isDrop ? (
                        <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <TrendingDown size={15} />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <AlertTriangle size={15} />
                        </span>
                      )}
                      <h4 className="text-cosmic-text font-bold text-base">{insight.title}</h4>
                    </div>

                    {/* Summary */}
                    <div>
                      <h5 className="text-[10px] text-cosmic-muted uppercase tracking-wider font-bold">Summary</h5>
                      <p className="text-xs text-cosmic-text mt-1 leading-relaxed">{insight.summary}</p>
                    </div>

                    {/* Cause */}
                    <div>
                      <h5 className="text-[10px] text-cosmic-muted uppercase tracking-wider font-bold">Why it happened</h5>
                      <p className="text-xs text-cosmic-text opacity-95 mt-1 leading-relaxed">{insight.cause}</p>
                    </div>

                    {/* Actions */}
                    <div>
                      <h5 className="text-[10px] text-cosmic-muted uppercase tracking-wider font-bold">Recommended Actions</h5>
                      <ul className="mt-2 space-y-2 text-xs text-cosmic-text">
                        {insight.actions && insight.actions.map((act, index) => (
                          <li key={index} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-cosmic-bg/60 border border-cosmic-border/60">
                            <ArrowRight size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Side Options / Actions */}
                  <div className="flex md:flex-col justify-end items-end shrink-0 gap-2">
                    <span className="text-[10px] font-mono font-bold text-cosmic-muted bg-cosmic-bg px-2 py-1 rounded-lg border border-cosmic-border">
                      {insight.id}
                    </span>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-md shadow-indigo-600/10 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                      <Play size={11} />
                      <span>Run Task</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
