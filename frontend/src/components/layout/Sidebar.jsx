import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Layers,
  GitMerge,
  PlayCircle,
  Skull,
  FileText,
  History,
  Settings,
  Activity,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const Sidebar = () => {
  const { selectedAgent } = useAgent();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Agent Config', path: '/agents', icon: Bot },
    { name: 'Scenario Matrix', path: '/scenarios', icon: Layers },
    { name: 'Failure Chains', path: '/chains', icon: GitMerge, badge: 'Signature' },
    { name: 'Live Trace & Run', path: '/execute', icon: PlayCircle },
    { name: 'Agent Autopsy', path: '/autopsy', icon: Skull, badge: 'Forensic' },
    { name: 'Reliability Report', path: '/reports', icon: FileText },
    { name: 'Test History', path: '/history', icon: History },
    { name: 'Settings & Sandbox', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Logo */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-100 font-mono text-base">
              AGENT<span className="text-cyan-400">X-RAY</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
              OOSC 4.0 Hackathon
            </div>
          </div>
        </Link>
      </div>

      {/* Active Agent Snapshot Pill */}
      {selectedAgent && (
        <div className="mx-3.5 my-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              selectedAgent.reliabilityScore >= 90 ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' :
              selectedAgent.reliabilityScore >= 70 ? 'bg-cyan-400 shadow-[0_0_8px_#06B6D4]' :
              'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
            }`} />
            <div className="truncate">
              <div className="text-[13px] font-bold text-slate-100 truncate">{selectedAgent.name}</div>
              <div className="text-xs text-slate-300 font-mono font-medium">Score: {selectedAgent.reliabilityScore}/100</div>
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
            selectedAgent.status === 'Hardened' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40' :
            'bg-amber-500/15 text-amber-300 border border-amber-500/40'
          }`}>
            {selectedAgent.status}
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Suite
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={17} className="shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer / Problem Statement Tag */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono font-medium">
          <ShieldAlert size={15} className="text-rose-400 shrink-0" />
          <span className="truncate">PS4: AI Agent Evaluation</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          Crash testing for autonomous agents
        </div>
      </div>
    </aside>
  );
};
