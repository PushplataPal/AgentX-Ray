import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  const variantMap = {
    critical: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    high: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    low: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    safe: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    cyber: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    purple: 'bg-purple-950/60 text-purple-300 border border-purple-500/40',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
  };

  const normalized = (variant || 'neutral').toLowerCase();
  const appliedClass = variantMap[normalized] || variantMap.neutral;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md uppercase tracking-wider ${sizeClasses[size]} ${appliedClass} ${className}`}>
      {children}
    </span>
  );
};
