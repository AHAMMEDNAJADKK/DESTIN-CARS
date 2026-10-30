import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const AlertNotification = ({ notification, onClose }) => {
  if (!notification || !notification.message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-950 text-white border-emerald-500 shadow-emerald-900/40',
      icon: <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0" />,
      accent: 'bg-lime-400'
    },
    error: {
      bg: 'bg-rose-950 text-white border-rose-500 shadow-rose-950/40',
      icon: <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
      accent: 'bg-rose-500'
    },
    warning: {
      bg: 'bg-amber-950 text-white border-amber-500 shadow-amber-950/40',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
      accent: 'bg-amber-400'
    },
    info: {
      bg: 'bg-slate-900 text-white border-emerald-500 shadow-slate-950/40',
      icon: <Info className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
      accent: 'bg-emerald-400'
    }
  };

  const current = typeConfig[notification.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-200 no-print">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${current.bg}`}>
        <div className="mt-0.5">{current.icon}</div>
        <div className="flex-1">
          {notification.title && (
            <h4 className="font-semibold text-sm tracking-wide text-white mb-0.5">
              {notification.title}
            </h4>
          )}
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertNotification;
