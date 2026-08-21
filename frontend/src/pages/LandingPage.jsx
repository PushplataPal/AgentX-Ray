import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Zap,
  Skull,
  FileCheck,
  GitMerge,
  Radar,
  Lock,
  Play,
  Layers
} from 'lucide-react';
import { DemoBadge } from '../components/common/DemoBadge';

export const LandingPage = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { num: '01', title: 'CONFIGURE', desc: 'Define agent system prompt, permissions & sensitive tool boundaries.' },
    { num: '02', title: 'GENERATE', desc: 'Generate multi-category adversarial scenarios & complex failure chains.' },
    { num: '03', title: 'EXECUTE', desc: 'Run in a controlled mock sandbox capturing full event-driven traces.' },
    { num: '04', title: 'ANALYZE', desc: 'Detect 9+ failure modes, produce Failure Fingerprints & Agent Autopsies.' },
    { num: '05', title: 'REPORT', desc: 'Compute 5-axis Reliability Scores & apply 1-click hardened remediations.' }
  ];

  const features = [
    {
      icon: ShieldAlert,
      title: 'Adversarial Scenarios',
      desc: 'Automatic generator for Prompt Injection, Goal Drift, Unsafe Actions, Tool Loops, and Multi-turn Manipulation.',
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/20'
    },
    {
      icon: GitMerge,
      title: 'Multi-Step Failure Chains',
      desc: 'Test complex cascaded attack chains instead of single prompts to uncover compounding systemic vulnerabilities.',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
    },
    {
      icon: Terminal,
      title: 'Live Execution Tracing',
      desc: 'Granular step-by-step visualizer of user prompts, cognitive thoughts, tool parameters, and intercept policy checks.',
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20'
    },
    {
      icon: Radar,
      title: 'Failure Fingerprints',
      desc: 'Unique 6-axis vulnerability DNA profile identifying exact cognitive blind spots and risk vectors.',
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/20'
    },
    {
      icon: Skull,
      title: 'Forensic Agent Autopsy',
      desc: 'Deep post-mortem analysis: What happened, Where it failed, Why it failed, Risk created, and Recommended fix.',
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    },
    {
      icon: FileCheck,
      title: '5-Axis Reliability Score',
      desc: 'Weighted 0-100 evaluation scoring Task Accuracy, Tool Safety, Goal Adherence, Attack Resistance, and Recovery.',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-mono font-bold tracking-wider text-base text-slate-100">
              AGENT<span className="text-cyan-400">X-RAY</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <DemoBadge />
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
            >
              <span>Launch Platform</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Background glow flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-400 font-bold">OOSC 4.0 Hackathon</span>
            <span className="text-slate-500">|</span>
            <span>Problem Statement 4: AI Agent Evaluation & Reliability Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 font-sans leading-tight">
            Crash Testing for <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Autonomous AI Agents
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            "See how your AI agent thinks, fails, and behaves under pressure."
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Automatically generate adversarial scenarios, execute in a controlled mock sandbox, capture execution traces, detect failure modes, generate forensic Agent Autopsies, and measure reliability before production deployment.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Zap size={16} fill="currentColor" />
              <span>Analyze an Agent</span>
            </button>

            <button
              onClick={() => navigate('/execute')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Play size={16} />
              <span>Run Showcase Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow Pipeline */}
      <section className="py-16 px-6 border-y border-slate-800/80 bg-[#0B0F19]/50">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400">
              END-TO-END VERIFICATION LIFECYCLE
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              How AgentX-Ray Evaluates AI Agents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.num}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative group hover:border-cyan-500/40 transition-all"
              >
                <div className="text-3xl font-extrabold font-mono text-slate-700 group-hover:text-cyan-400 transition-colors mb-2">
                  {step.num}
                </div>
                <div className="text-xs font-bold font-mono tracking-wider text-slate-200 uppercase mb-1">
                  {step.title}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400">
            SIGNATURE CAPABILITIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Deep Diagnostic Engine for Autonomous Agents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`p-6 rounded-xl border ${feat.color} space-y-3 transition-all hover:shadow-lg`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-white/10">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hackathon Demo Teaser Banner */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 to-cyan-950/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto p-8 rounded-2xl border border-cyan-500/30 bg-black/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 text-xs font-mono font-semibold">
              <Zap size={13} />
              Interactive Hackathon Demo Ready
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Try the RefundBot 68 → 94 Remediation Flow
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Experience the complete lifecycle: see RefundBot fail an adversarial refund bypass, inspect the autopsy, apply the recommended verification guardrail, and witness the reliability score leap by +26 points.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            Launch Interactive Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        AgentX-Ray | OOSC 4.0 Hackathon – Problem Statement 4: AI Agent Evaluation & Reliability Engine
      </footer>
    </div>
  );
};
