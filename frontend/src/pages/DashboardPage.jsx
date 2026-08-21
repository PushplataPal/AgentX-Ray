import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bot,
  Play,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { ReliabilityRadar } from '../components/charts/ReliabilityRadar';
import { TrendChart } from '../components/charts/TrendChart';
import { FailureBarChart } from '../components/charts/FailureBarChart';
import { BeforeAfterComparison } from '../components/autopsy/BeforeAfterComparison';

export const DashboardPage = () => {
  const { agents, selectedAgent, applyFixToSelectedAgent, showToast } = useAgent();
  const [failures, setFailures] = useState([]);
  const [runs, setRuns] = useState([]);
  const [fingerprint, setFingerprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!selectedAgent) return;
      try {
        setLoading(true);
        const [failRes, runRes, fpRes] = await Promise.all([
          api.getFailures({ agentId: selectedAgent.id }),
          api.getRuns({ agentId: selectedAgent.id }),
          api.getFailureFingerprint(selectedAgent.id)
        ]);

        if (failRes?.data) setFailures(failRes.data);
        if (runRes?.data) setRuns(runRes.data);
        if (fpRes?.fingerprint) setFingerprint(fpRes.fingerprint);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedAgent]);

  const score = selectedAgent?.reliabilityScore || 68;
  const isHardened = selectedAgent?.appliedFixes && selectedAgent.appliedFixes.length > 0;

  // Breakdown metrics
  const metrics = isHardened ? {
    taskAccuracy: 95,
    toolSafety: 96,
    goalAdherence: 94,
    attackResistance: 92,
    recoveryAbility: 92,
    hallucinationResistance: 94
  } : {
    taskAccuracy: 78,
    toolSafety: 48,
    goalAdherence: 74,
    attackResistance: 52,
    recoveryAbility: 62,
    hallucinationResistance: 76
  };

  const handle1ClickFix = async () => {
    await applyFixToSelectedAgent();
    // Refresh dashboard data
    const fpRes = await api.getFailureFingerprint(selectedAgent.id);
    if (fpRes?.fingerprint) setFingerprint(fpRes.fingerprint);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & High-Level KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <Activity size={16} />
            <span>AI AGENT RELIABILITY PLATFORM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1 tracking-tight">
            Agent Reliability Intelligence
          </h1>
          <p className="text-[13px] text-slate-300 mt-0.5 leading-relaxed">
            Real-time evaluation, failure mode detection, and reliability scoring for autonomous agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/scenarios')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Layers size={15} />
            <span>Scenario Matrix</span>
          </button>
          <button
            onClick={() => navigate('/execute')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
          >
            <Play size={15} fill="currentColor" />
            <span>Run Test Sandbox</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Bot size={24} />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Total Agents</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">{agents.length || 3}</div>
            <div className="text-[11px] text-cyan-400 font-medium">Active evaluation pool</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Tests Executed</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">148</div>
            <div className="text-[11px] text-blue-400 font-medium">Adversarial & multi-step</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950/70 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Critical Failures</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
              {failures.filter(f => f.severity === 'CRITICAL').length || 3}
            </div>
            <div className="text-[11px] text-rose-400 font-medium">Requires remediation</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Avg. Reliability</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
              {isHardened ? '94/100' : '81.3/100'}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">+12% benchmark trend</div>
          </div>
        </Card>
      </div>

      {/* Main Agent Focus Card & Score Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Agent Card (2 cols) */}
        <Card className="lg:col-span-2 space-y-6" glow={isHardened} danger={!isHardened && score < 70}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
                <Bot size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                    {selectedAgent?.name || 'RefundBot'}
                  </h2>
                  <Badge variant={selectedAgent?.riskLevel?.toLowerCase() || 'high'} size="sm">
                    {selectedAgent?.riskLevel || 'HIGH RISK'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-medium">
                  {selectedAgent?.description || 'Autonomous FinTech refund processing agent.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isHardened ? (
                <button
                  onClick={handle1ClickFix}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2"
                >
                  <Wrench size={15} />
                  <span>Apply Recommended Fix</span>
                </button>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 size={15} />
                  Hardened Guardrails Active
                </span>
              )}
            </div>
          </div>

          {/* Score & 5-Axis Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <ScoreGauge
                score={score}
                size={140}
                subtitle={isHardened ? 'Secured Guardrails' : 'Needs Attention'}
              />
            </div>

            {/* Category Progress Bars */}
            <div className="md:col-span-2 space-y-3.5">
              <div className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider mb-1">
                5-Axis Reliability Breakdown:
              </div>

              {[
                { label: 'Task Accuracy', val: metrics.taskAccuracy, weight: '25%' },
                { label: 'Tool Safety', val: metrics.toolSafety, weight: '25%', danger: metrics.toolSafety < 60 },
                { label: 'Goal Adherence', val: metrics.goalAdherence, weight: '20%' },
                { label: 'Attack Resistance', val: metrics.attackResistance, weight: '15%', danger: metrics.attackResistance < 60 },
                { label: 'Recovery Ability', val: metrics.recoveryAbility, weight: '15%' }
              ].map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[13px] font-semibold text-slate-200">{m.label}</span>
                    <span className="text-slate-300">
                      <span className={`text-sm font-extrabold ${m.danger ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {m.val}%
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-normal">({m.weight})</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        m.val >= 90 ? 'bg-emerald-400' :
                        m.val >= 70 ? 'bg-cyan-400' :
                        m.val >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${m.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Failure Fingerprint Radar (1 col) */}
        <Card className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Activity size={15} className="text-rose-400" />
              <span>Failure Fingerprint</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/35">
              VULNERABILITY DNA
            </span>
          </div>

          <div className="flex-1 min-h-[230px]">
            <ReliabilityRadar fingerprint={fingerprint} height={240} />
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-slate-800 text-xs font-mono text-slate-300 truncate">
            DNA: <span className="text-cyan-400 font-bold">{fingerprint?.dnaCode || 'XR-REF-882:TM_HIGH+GD_MED'}</span>
          </div>
        </Card>
      </div>

      {/* Before / After Showcase Card */}
      <BeforeAfterComparison
        beforeScore={68}
        afterScore={94}
        onReRunAfterFix={() => navigate('/execute')}
      />

      {/* Bottom Grid: Recent Failures Stream & Reliability Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Failures Stream */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono">
                Recent Detected Failures
              </h3>
            </div>
            <button
              onClick={() => navigate('/autopsy')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View Autopsies</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {(failures.length > 0 ? failures.slice(0, 3) : [
              {
                id: 'f1',
                severity: 'CRITICAL',
                title: 'Unauthorized Refund Execution',
                failureType: 'UNSAFE_TOOL_ACTION',
                timeAgo: '2 minutes ago',
                impact: 'Direct financial leakage; skipped customer identity 2FA.'
              },
              {
                id: 'f2',
                severity: 'HIGH',
                title: 'Adversarial Prompt Injection Compliance',
                failureType: 'PROMPT_INJECTION',
                timeAgo: '12 minutes ago',
                impact: 'Accepted fake supervisor override tag.'
              },
              {
                id: 'f3',
                severity: 'MEDIUM',
                title: 'Objective Abandonment & Goal Drift',
                failureType: 'GOAL_DRIFT',
                timeAgo: '25 minutes ago',
                impact: 'Drifted into unauthorized Python code generation.'
              }
            ]).map((fail) => (
              <div
                key={fail.id}
                onClick={() => navigate('/autopsy')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Badge variant={fail.severity.toLowerCase()} size="sm">
                      {fail.severity}
                    </Badge>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {fail.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock size={12} />
                    {fail.timeAgo || 'Recent'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono text-xs text-slate-400 font-semibold">{fail.failureType}</span>
                  <span className="text-xs text-slate-300 truncate max-w-xs">{fail.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Historical Reliability Trend */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono">
                Reliability Score History
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono font-medium">5 Runs Logged</span>
          </div>

          <div className="h-[230px]">
            <TrendChart height={230} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-800 pt-3">
            <span>Benchmark Status: <strong className="text-emerald-400 font-semibold">Remediated (+26 pts)</strong></span>
            <button
              onClick={() => navigate('/history')}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Full Test Log</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
