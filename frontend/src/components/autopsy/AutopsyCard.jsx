import React from 'react';
import {
  Skull,
  AlertOctagon,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  Wrench,
  FileCode,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AutopsyCard = ({ autopsy, onApplyFix, isFixApplied = false }) => {
  if (!autopsy) {
    return (
      <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/30">
        <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
        <div className="text-sm font-bold text-slate-200">No Critical Failures Detected</div>
        <div className="text-xs text-slate-400 mt-1">Agent passed safety guardrails and policy constraints.</div>
      </div>
    );
  }

  return (
    <div className="cyber-card-danger rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Autopsy Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-rose-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-950/90 border border-rose-500/60 flex items-center justify-center text-rose-400 shadow-md">
            <Skull size={24} />
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-rose-400 font-bold">
              AGENT FORENSIC AUTOPSY
            </div>
            <h3 className="text-xl font-extrabold text-slate-100 mt-0.5">
              {autopsy.failureTitle}
            </h3>
          </div>
        </div>
        <Badge variant={autopsy.severity?.toLowerCase() || 'critical'} size="lg">
          {autopsy.severity}
        </Badge>
      </div>

      {/* 7 Core Autopsy Forensic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. What Happened */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
            <AlertOctagon size={15} />
            <span>1. WHAT HAPPENED?</span>
          </div>
          <p className="text-[13px] text-slate-200 leading-relaxed font-medium">
            {autopsy.whatHappened || 'The agent attempted to execute a sensitive refund action before customer verification.'}
          </p>
        </div>

        {/* 2. Where Failed */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            <Wrench size={15} />
            <span>2. WHERE DID IT FAIL?</span>
          </div>
          <p className="text-[13px] font-mono text-amber-300 font-bold leading-relaxed">
            {autopsy.whereFailed || 'issueRefund()'}
          </p>
        </div>

        {/* 3. Why Failed */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            <HelpCircle size={15} />
            <span>3. WHY DID IT FAIL?</span>
          </div>
          <p className="text-[13px] text-slate-200 leading-relaxed font-medium">
            {autopsy.whyFailed || 'The agent accepted a user-provided instruction attempting to bypass the verification requirement.'}
          </p>
        </div>

        {/* 4. Risk Created */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
            <ShieldAlert size={15} />
            <span>4. RISK CREATED</span>
          </div>
          <p className="text-[13px] text-slate-200 leading-relaxed font-medium">
            {autopsy.riskCreated || 'Potential unauthorized financial transaction.'}
          </p>
        </div>

        {/* 5. Expected Safe Behaviour */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 md:col-span-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            <CheckCircle2 size={15} />
            <span>5. EXPECTED BEHAVIOUR</span>
          </div>
          <p className="text-[13px] text-emerald-200/90 leading-relaxed font-medium">
            {autopsy.expectedBehaviour || 'The agent should have verified the customer before attempting the sensitive action.'}
          </p>
        </div>

        {/* 6. Root Cause */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-1.5 md:col-span-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
            <GitCommit size={15} />
            <span>6. ROOT CAUSE</span>
          </div>
          <p className="text-[13px] text-purple-200 font-mono leading-relaxed font-bold">
            {autopsy.rootCause || 'Missing enforcement of the verification guard during tool selection.'}
          </p>
        </div>
      </div>

      {/* 7. Recommended Fix */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/40 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            <Sparkles size={16} />
            <span>7. RECOMMENDED FIX</span>
          </div>

          {onApplyFix && (
            <button
              onClick={onApplyFix}
              disabled={isFixApplied}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                isFixApplied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all shadow-sm'
              }`}
            >
              {isFixApplied ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Fix Applied (Hardened)</span>
                </>
              ) : (
                <>
                  <Wrench size={14} />
                  <span>Apply Recommended Fix</span>
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-[13px] text-slate-100 leading-relaxed font-bold font-mono">
          {autopsy.recommendedFix || 'Require customerVerified === true before issueRefund() can be called.'}
        </p>

        {autopsy.remediationCode && (
          <div className="pt-1">
            <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1 font-semibold">
              <FileCode size={13} className="text-cyan-400" /> Suggested Guardrail Patch:
            </div>
            <pre className="p-3.5 rounded-xl bg-black/70 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {autopsy.remediationCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
