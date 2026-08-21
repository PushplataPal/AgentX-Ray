import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Bot, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { DemoBadge } from '../common/DemoBadge';

export const Topbar = () => {
  const { agents, selectedAgent, selectAgentById } = useAgent();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#0B0F19]/90 border-b border-slate-800/80 backdrop-blur-md fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6">
      {/* Left: Active Agent Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-cyan-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Agent:</span>
        </div>

        <div className="relative">
          <select
            value={selectedAgent?.id || ''}
            onChange={(e) => selectAgentById(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.reliabilityScore}/100 - {agent.status})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Security Status Tag */}
        {selectedAgent && (
          <div className="hidden md:flex items-center gap-2 text-xs">
            {selectedAgent.appliedFixes && selectedAgent.appliedFixes.length > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
                <CheckCircle2 size={12} />
                Hardened ({selectedAgent.appliedFixes.length} Guardrails Active)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-medium animate-pulse">
                <AlertTriangle size={12} />
                Unprotected (Vulnerabilities Detected)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Demo Mode Badge & Run Action */}
      <div className="flex items-center gap-4">
        <DemoBadge />

        <button
          onClick={() => navigate('/execute')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform active:scale-95"
        >
          <Play size={14} fill="currentColor" />
          <span>Run Analysis</span>
        </button>
      </div>
    </header>
  );
};
