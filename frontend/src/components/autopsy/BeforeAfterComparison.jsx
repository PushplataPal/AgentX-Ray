import React, { useState, useEffect } from 'react';
import { ScoreGauge } from '../common/ScoreGauge';
import { ArrowRight, ShieldCheck, ShieldAlert, Sparkles, TrendingUp, Play, CheckCircle2, RefreshCw } from 'lucide-react';

export const BeforeAfterComparison = ({
  beforeScore = 68,
  afterScore = 94,
  onReRunAfterFix
}) => {
  const [displayAfterScore, setDisplayAfterScore] = useState(beforeScore);
  const delta = afterScore - beforeScore;

  // Animated counter for afterScore
  useEffect(() => {
    let start = beforeScore;
    const end = afterScore;
    const duration = 1200;
    const increment = (end - start) / (duration / 25);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayAfterScore(end);
        clearInterval(timer);
      } else {
        setDisplayAfterScore(Math.round(start));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [beforeScore, afterScore]);

  return (
    <div className="cyber-card-glow rounded-2xl p-6 sm:p-7 relative overflow-hidden space-y-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <Sparkles size={16} />
            <span>REMEDIATION COMPARISON</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
            Before / After Safety Hardening
          </h3>
          <p className="text-[13px] text-slate-300 mt-0.5 leading-relaxed">
            Sensitive tool execution is now protected by mandatory customer verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono font-extrabold text-base shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <TrendingUp size={20} />
            <span>+{delta} Reliability Points</span>
          </div>

          {onReRunAfterFix && (
            <button
              onClick={onReRunAfterFix}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              <RefreshCw size={14} />
              <span>Re-Run Same Scenario</span>
            </button>
          )}
        </div>
      </div>

      {/* Side by side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* BEFORE FIX */}
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/35 space-y-4 shadow-[0_0_20px_rgba(244,63,94,0.08)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-rose-400 font-mono">
              <ShieldAlert size={16} />
              <span>BEFORE FIX</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
              Needs Attention
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-rose-400">
              {beforeScore} <span className="text-lg text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-xs font-bold text-rose-300 uppercase font-mono tracking-wider">
              Needs Attention
            </div>
          </div>

          <div className="text-[13px] text-slate-200 space-y-2.5 border-t border-rose-500/20 pt-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Tool Safety:</span>
              <span className="font-extrabold text-rose-400 text-sm">48%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Attack Resistance:</span>
              <span className="font-extrabold text-rose-400 text-sm">51%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Task Accuracy:</span>
              <span className="font-bold text-slate-200 text-sm">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Goal Adherence:</span>
              <span className="font-bold text-slate-200 text-sm">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Recovery Ability:</span>
              <span className="font-bold text-slate-200 text-sm">69%</span>
            </div>
          </div>
        </div>

        {/* AFTER FIX */}
        <div className="p-6 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 font-mono">
              <ShieldCheck size={16} />
              <span>AFTER FIX</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Excellent
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400">
              {displayAfterScore} <span className="text-lg text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-xs font-bold text-emerald-300 uppercase font-mono tracking-wider">
              Excellent (Production Ready)
            </div>
          </div>

          <div className="text-[13px] text-slate-200 space-y-2.5 border-t border-emerald-500/20 pt-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Tool Safety:</span>
              <span className="font-extrabold text-emerald-400 text-sm">96% <span className="text-xs text-emerald-300 font-normal">(+48)</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Attack Resistance:</span>
              <span className="font-extrabold text-emerald-400 text-sm">92% <span className="text-xs text-emerald-300 font-normal">(+41)</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Task Accuracy:</span>
              <span className="font-extrabold text-emerald-400 text-sm">95% <span className="text-xs text-emerald-300 font-normal">(+17)</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Goal Adherence:</span>
              <span className="font-extrabold text-emerald-400 text-sm">94% <span className="text-xs text-emerald-300 font-normal">(+22)</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Recovery Ability:</span>
              <span className="font-extrabold text-emerald-400 text-sm">91% <span className="text-xs text-emerald-300 font-normal">(+22)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Hardening Note */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-[13px] text-slate-200">
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold text-slate-100">Security Invariant Enforced: </span>
          <span>Sensitive tool execution is now protected by mandatory customer verification. Reliability improved by <strong className="text-emerald-400">+{delta} points</strong> (68 → 94).</span>
        </div>
      </div>
    </div>
  );
};
