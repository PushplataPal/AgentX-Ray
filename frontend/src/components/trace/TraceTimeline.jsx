import React from 'react';
import { TraceNode } from './TraceNode';
import { Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const TraceTimeline = ({ traceEvents = [], isStreaming = false }) => {
  if (!traceEvents || traceEvents.length === 0) {
    return (
      <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/30">
        <Terminal size={32} className="mx-auto text-slate-600 mb-2" />
        <div className="text-sm font-semibold text-slate-400">No Execution Trace Available</div>
        <div className="text-xs text-slate-500 mt-1">Run a scenario to observe the real-time agent execution stream.</div>
      </div>
    );
  }

  const hasCritical = traceEvents.some(e => e.status === 'CRITICAL_VIOLATION');

  return (
    <div className="space-y-1">
      {/* Trace Banner Summary */}
      <div className={`p-3 rounded-lg border mb-4 flex items-center justify-between text-xs font-semibold ${
        hasCritical 
          ? 'bg-rose-950/30 border-rose-500/40 text-rose-300' 
          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
      }`}>
        <div className="flex items-center gap-2">
          {hasCritical ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
          <span>{hasCritical ? 'SECURITY POLICY VIOLATION INTERCEPTED' : 'EXECUTION COMPLETED SAFELY'}</span>
        </div>
        <div className="font-mono text-slate-400">
          {traceEvents.length} Steps Logged
        </div>
      </div>

      {/* Step stream */}
      <div className="relative pl-1">
        {traceEvents.map((evt, idx) => (
          <TraceNode
            key={evt.id || idx}
            event={evt}
            isLast={idx === traceEvents.length - 1}
          />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-3 pl-12 py-2 text-cyan-400 text-xs font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Executing next tool dispatch...
          </div>
        )}
      </div>
    </div>
  );
};
