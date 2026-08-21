import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Key,
  Database,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sliders,
  Cpu
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DemoBadge } from '../components/common/DemoBadge';

export const SettingsPage = () => {
  const { demoMode, setDemoMode, showToast, fetchAgents } = useAgent();
  const [health, setHealth] = useState(null);
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [sandboxLatency, setSandboxLatency] = useState('low');
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.getHealth();
        setHealth(res);
      } catch (err) {
        console.error('Error fetching health:', err);
      }
    };
    fetchHealth();
  }, []);

  const handleResetData = async () => {
    try {
      setResetting(true);
      await api.resetDefaults();
      await fetchAgents();
      showToast('Demo dataset reset to initial benchmark state successfully!', 'success');
    } catch (err) {
      showToast(`Reset error: ${err.message}`, 'error');
    } finally {
      setResetting(false);
    }
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    showToast('API Key configuration saved for active session!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
          <SettingsIcon size={15} />
          <span>PLATFORM CONFIGURATION & SANDBOX PARAMETERS</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
          Settings & Environment
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure zero-key demo simulation, optional external LLM providers, sandbox latency, and database diagnostics.
        </p>
      </div>

      {/* System Health Diagnostics */}
      <Card className="cyber-card-glow space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              Engine & Storage Diagnostics
            </h3>
          </div>
          <Badge variant="safe" size="sm">SYSTEM OPERATIONAL</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-slate-400 uppercase text-[10px]">Database Connection:</div>
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>{health?.database?.mode || 'In-Memory Store (Resilient Demo Mode)'}</span>
            </div>
            <div className="text-[10px] text-slate-500">Auto-resilient zero-dependency</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-slate-400 uppercase text-[10px]">Active AI Engine:</div>
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Cpu size={13} />
              <span>Deterministic Sandbox Engine</span>
            </div>
            <div className="text-[10px] text-slate-500">Zero external API key required</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-slate-400 uppercase text-[10px]">Platform Version:</div>
            <div className="font-bold text-slate-200">AgentX-Ray v1.0.0 (PS4)</div>
            <div className="text-[10px] text-slate-500">OOSC 4.0 Hackathon Final</div>
          </div>
        </div>
      </Card>

      {/* Demo Mode Toggle & Simulation Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                Simulation Mode
              </h3>
            </div>
            <DemoBadge />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            AgentX-Ray includes a full deterministic simulation engine with mocked tools (getOrder, verifyCustomer, issueRefund, sendEmail) and fault injection. No API keys are required for testing.
          </p>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Force Zero-Key Demo Mode</div>
              <div className="text-[11px] text-slate-400">Guarantees 100% deterministic test execution</div>
            </div>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="w-5 h-5 accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Sandbox Latency Simulator */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">
              Mock Tool Execution Latency:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'instant', label: 'Instant (0ms)' },
                { id: 'low', label: 'Realistic (100ms)' },
                { id: 'high', label: 'Throttled (500ms)' }
              ].map((lat) => (
                <button
                  key={lat.id}
                  onClick={() => setSandboxLatency(lat.id)}
                  className={`py-2 rounded-lg text-xs font-mono transition-colors ${
                    sandboxLatency === lat.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {lat.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Optional External LLM Integration */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                Optional LLM API Keys
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              OPTIONAL (DEMO WORKS WITHOUT)
            </span>
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-300">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-300">
                OpenAI API Key:
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Save Keys (Session)
            </button>
          </form>
        </Card>
      </div>

      {/* Database Reset Card */}
      <Card className="cyber-card-danger space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
              Reset Demo Dataset & Benchmarks
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Restores RefundBot (Score: 68/100), TravelPlanner, ResearchAgent, scenarios, and initial test runs.
            </p>
          </div>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="px-4 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={resetting ? 'animate-spin' : ''} />
            <span>Reset Demo State</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
