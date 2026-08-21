import React, { useState } from 'react';
import {
  MessageSquare,
  Brain,
  Wrench,
  CornerDownRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Code
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const TraceNode = ({ event, isLast = false, onInspectPayload }) => {
  const [expanded, setExpanded] = useState(false);

  const getEventIcon = (type, status) => {
    switch (type) {
      case 'USER_INPUT':
        return <MessageSquare size={16} className="text-cyan-400" />;
      case 'AGENT_THOUGHT':
      case 'AGENT_DECISION':
        return <Brain size={16} className="text-purple-400" />;
      case 'TOOL_CALL':
        return <Wrench size={16} className="text-blue-400" />;
      case 'TOOL_RESPONSE':
        return <CornerDownRight size={16} className="text-emerald-400" />;
      case 'SECURITY_POLICY_CHECK':
        return <ShieldCheck size={16} className="text-emerald-400" />;
      case 'POLICY_VIOLATION':
        return <ShieldAlert size={16} className="text-rose-400 animate-pulse" />;
      case 'FINAL_RESPONSE':
        return status === 'CRITICAL_VIOLATION' 
          ? <ShieldAlert size={16} className="text-rose-400" />
          : <CheckCircle size={16} className="text-emerald-400" />;
      default:
        return <Brain size={16} className="text-slate-400" />;
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'CRITICAL_VIOLATION':
        return 'border-rose-500/50 bg-rose-950/25 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'WARNING':
        return 'border-amber-500/40 bg-amber-950/20';
      case 'SAFE':
        return 'border-emerald-500/40 bg-emerald-950/20';
      default:
        return 'border-slate-800 bg-slate-900/80';
    }
  };

  const hasPayload = (event.inputParams && Object.keys(event.inputParams).length > 0) ||
    (event.outputResult && Object.keys(event.outputResult).length > 0) ||
    event.violationDetails;

  return (
    <div className="relative flex gap-4 group">
      {/* Timeline spine vertical line */}
      {!isLast && (
        <div className="absolute left-4 top-9 bottom-0 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors" />
      )}

      {/* Step Icon Node */}
      <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
        event.status === 'CRITICAL_VIOLATION' ? 'border-rose-500 bg-rose-950/90' :
        event.status === 'WARNING' ? 'border-amber-500 bg-amber-950/90' :
        event.status === 'SAFE' ? 'border-emerald-500 bg-emerald-950/90' :
        'border-slate-700 bg-slate-800'
      }`}>
        {getEventIcon(event.eventType, event.status)}
      </div>

      {/* Event Details Card */}
      <div className={`flex-1 rounded-xl border p-4 mb-4 transition-all duration-200 ${getStatusBorder(event.status)}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-300">
                #{event.stepNumber}
              </span>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {event.title}
              </h4>
              {event.toolName && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-500/40">
                  {event.toolName}()
                </span>
              )}
              <Badge variant={event.status.toLowerCase()} size="sm">
                {event.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-[13px] text-slate-200 mt-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {event.durationMs > 0 && (
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock size={13} />
                {event.durationMs}ms
              </span>
            )}
            {hasPayload && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Toggle JSON Payload"
              >
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Collapsible JSON payload drawer */}
        {expanded && hasPayload && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-xs">
            {event.inputParams && Object.keys(event.inputParams).length > 0 && (
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Code size={12} className="text-cyan-400" /> Input Parameters:
                </div>
                <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  {JSON.stringify(event.inputParams, null, 2)}
                </pre>
              </div>
            )}

            {event.outputResult && Object.keys(event.outputResult).length > 0 && (
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Code size={12} className="text-emerald-400" /> Output / State Result:
                </div>
                <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  {JSON.stringify(event.outputResult, null, 2)}
                </pre>
              </div>
            )}

            {event.violationDetails && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-200 font-mono text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <ShieldAlert size={14} className="text-rose-400" />
                  POLICY VIOLATION SPECIFICATION:
                </div>
                <div>Rule: <span className="font-semibold text-white">{event.violationDetails.rule || event.violationDetails.message}</span></div>
                <div>Severity: <span className="font-extrabold text-rose-400">{event.violationDetails.severity}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
