import React from 'react';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * Renders a premium, glassmorphic toast-based confirmation dialog.
 * Adapts automatically to light/dark cosmic themes.
 * 
 * @param {string} message - The message details to display
 * @param {object} options - Optional overrides for title, texts, and callbacks
 */
export const confirmToast = (message, {
  title = 'Are you sure?',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'info' | 'warning'
  onConfirm = () => {},
  onCancel = () => {},
} = {}) => {
  return toast.custom((t) => (
    <div
      className={`
        ${t.visible ? 'animate-in fade-in zoom-in duration-200' : 'animate-out fade-out zoom-out duration-150'}
        max-w-md w-full glass-panel shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-5 flex gap-4 pointer-events-auto
      `}
      style={{
        background: 'var(--cosmic-card)',
        border: '1px solid var(--cosmic-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
        type === 'danger' 
          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
          : type === 'warning'
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
      }`}>
        {type === 'danger' ? (
          <Trash2 className="w-5.5 h-5.5 animate-pulse" />
        ) : (
          <AlertTriangle className="w-5.5 h-5.5 animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-cosmic-text flex items-center gap-1.5 leading-none">
          {title}
        </h4>
        <p className="text-xs text-cosmic-muted mt-2 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-2.5 mt-5">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (onCancel) onCancel();
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-cosmic-border bg-transparent text-cosmic-muted hover:bg-cosmic-card-hover hover:text-cosmic-text transition-all duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (onConfirm) onConfirm();
            }}
            className={`
              px-4 py-2 text-xs font-bold rounded-xl text-white shadow-lg transition-all duration-200 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]
              ${type === 'danger'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                : type === 'warning'
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                  : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center',
  });
};
