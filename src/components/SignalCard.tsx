import React from 'react';
import { SignalResult } from '../engine/types';

interface SignalCardProps {
  signal: SignalResult;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  // Determine severity based on weight/confidence
  const getSeverityStyle = () => {
    if (signal.weight > 70) return { border: 'border-[#ef4444]', glow: 'shadow-[-4px_0_15px_rgba(239,68,68,0.4)]', text: 'text-[#ef4444]', bg: 'bg-gradient-to-br from-[#ef4444]/20 to-transparent' };
    if (signal.weight > 40) return { border: 'border-[#f59e0b]', glow: 'shadow-[-4px_0_15px_rgba(245,158,11,0.4)]', text: 'text-[#f59e0b]', bg: 'bg-gradient-to-br from-[#f59e0b]/20 to-transparent' };
    return { border: 'border-[#10b981]', glow: 'shadow-[-4px_0_15px_rgba(16,185,129,0.4)]', text: 'text-[#10b981]', bg: 'bg-gradient-to-br from-[#10b981]/20 to-transparent' };
  };

  const severity = getSeverityStyle();

  const getIcon = () => {
    switch (signal.category?.toLowerCase()) {
      case 'otp':
      case 'security':
        return '🔒';
      case 'url':
      case 'link':
        return '🔗';
      case 'impersonation':
      case 'bank':
        return '🏦';
      case 'urgency':
      case 'pressure':
        return '⏱️';
      case 'grammar':
      case 'language':
        return '📝';
      default:
        return '⚠️';
    }
  };

  return (
    <div className={`p-3 mb-2.5 rounded-xl border-l-4 ${severity.border} bg-white/5 backdrop-blur-xl border-y border-r border-white/10 shadow-lg ${severity.glow} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-white/10 group`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 text-xl w-9 h-9 flex items-center justify-center rounded-lg ${severity.bg} border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-sm">
              {signal.signalName}
            </h3>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10 ${severity.text} shadow-inner`}>
              {Math.round(signal.confidence * 100)}% Match
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
            {signal.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
