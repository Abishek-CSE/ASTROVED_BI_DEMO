import React from 'react';
import { getAIInsights } from '../../services/mockData';
import { useDateFilter } from '../../contexts/DateFilterContext';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Play } from 'lucide-react';

const AIInsights = () => {
  const { startDate, endDate } = useDateFilter();
  const insights = getAIInsights(startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl flex items-center space-x-4 bg-gradient-to-r from-indigo-500/10 to-transparent">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Sparkles className="animate-pulse" size={24} />
        </div>
        <div>
          <h3 className="text-cosmic-text font-bold text-lg">AI-Driven Business Intelligence Insights</h3>
          <p className="text-xs text-cosmic-muted">
            Automatically scanning operations, traffic performance, and purchase trends to identify anomalies, causes, and actionable recommendations.
          </p>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-6">
        {insights.map((insight) => {
          const isIncrease = insight.type === 'increase';
          const isDrop = insight.type === 'drop';
          
          return (
            <div 
              key={insight.id}
              className={`bg-cosmic-card border border-cosmic-border p-6 rounded-2xl border-l-4 relative overflow-hidden ${
                isIncrease 
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
                      <span className="p-1 rounded bg-cosmic-success/20 text-cosmic-success bg-emerald-500/10 text-emerald-500">
                        <TrendingUp size={16} />
                      </span>
                    ) : isDrop ? (
                      <span className="p-1 rounded bg-cosmic-danger/20 text-cosmic-danger bg-rose-500/10 text-rose-500">
                        <TrendingDown size={16} />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-cosmic-accent/20 text-cosmic-accent bg-amber-500/10 text-amber-500">
                        <AlertTriangle size={16} />
                      </span>
                    )}
                    <h4 className="text-cosmic-text font-bold text-base">{insight.title}</h4>
                  </div>

                  {/* Summary */}
                  <div>
                    <h5 className="text-[10px] text-cosmic-muted uppercase tracking-wider font-semibold">Summary</h5>
                    <p className="text-xs text-cosmic-text mt-1">{insight.summary}</p>
                  </div>

                  {/* Cause */}
                  <div>
                    <h5 className="text-[10px] text-cosmic-muted uppercase tracking-wider font-semibold">Why it happened</h5>
                    <p className="text-xs text-cosmic-text opacity-90 mt-1">{insight.cause}</p>
                  </div>

                  {/* Actions */}
                  <div>
                    <h5 className="text-[10px] text-cosmic-muted uppercase tracking-wider font-semibold">Recommended Actions</h5>
                    <ul className="mt-2 space-y-2 text-xs text-cosmic-text">
                      {insight.actions.map((act, index) => (
                        <li key={index} className="flex items-start space-x-2 p-2 rounded-lg bg-cosmic-bg border border-cosmic-border">
                          <ArrowRight size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Right Side Options / Actions */}
                <div className="flex md:flex-col justify-end items-end shrink-0 gap-2">
                  <span className="text-[10px] font-mono text-cosmic-muted bg-cosmic-bg px-2 py-1 rounded border border-cosmic-border">
                    {insight.id}
                  </span>
                  <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all hover:scale-105 active:scale-95">
                    <Play size={12} />
                    <span>Run Task</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
