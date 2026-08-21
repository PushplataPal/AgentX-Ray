import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export const DemoBadge = () => {
  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.2)]"
      title="Zero-Key Demo Sandbox Mode: Deterministic and safe execution without requiring third-party API keys."
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <Zap size={12} className="text-cyan-400" />
      <span>DEMO MODE (ZERO-KEY)</span>
    </div>
  );
};
