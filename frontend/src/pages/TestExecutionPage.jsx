import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Skull,
  Wrench,
  Bot,
  Activity,
  Terminal,
  FastForward,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { TraceTimeline } from '../components/trace/TraceTimeline';
import { PlaybackControls } from '../components/trace/PlaybackControls';

export const TestExecutionPage = () => {
  const { selectedAgent, setLatestRun, showToast, applyFixToSelectedAgent } = useAgent();
  const [searchParams] = useSearchParams();
  const scenarioIdFromUrl = searchParams.get('scenarioId');
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');

  // Load scenarios
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const res = await api.getScenarios();
        if (res?.data) {
          setScenarios(res.data);
          if (scenarioIdFromUrl) {
            const found = res.data.find(s => s.id === scenarioIdFromUrl);
            if (found) setSelectedScenario(found);
          } else if (res.data.length > 0) {
            // Default to the critical unauthorized refund scenario for RefundBot
            const primary = res.data.find(s => s.id === 'scen-refund-unauth-critical') || res.data[0];
            setSelectedScenario(primary);
          }
        }
      } catch (err) {
        console.error('Error loading scenarios:', err);
      }
    };

    loadScenarios();
  }, [scenarioIdFromUrl]);

  // Execute Sandbox Test Run
  const handleExecute = async () => {
    if (!selectedAgent || !selectedScenario) return;
    try {
      setIsRunning(true);
      setVisibleEvents([]);
      setRunResult(null);

      const res = await api.executeRun({
        agentId: selectedAgent.id,
        scenarioId: selectedScenario.id,
        applyFix: Boolean(selectedAgent.appliedFixes && selectedAgent.appliedFixes.length > 0)
      });

      if (res?.data) {
        const testRun = res.data;
        setRunResult(testRun);
        setLatestRun(testRun);

        // Animate trace streaming according to playback speed
        if (playbackSpeed === 'instant') {
          setVisibleEvents(testRun.traceEvents || []);
          setIsRunning(false);
        } else {
          const delay = playbackSpeed === '2x' ? 250 : 500;
          const allEvents = testRun.traceEvents || [];
          for (let i = 0; i < allEvents.length; i++) {
            await new Promise(r => setTimeout(r, delay));
            setVisibleEvents(prev => [...prev, allEvents[i]]);
          }
          setIsRunning(false);
        }

        if (testRun.status === 'FAILED') {
          showToast('Security Policy Violation detected in agent execution trace!', 'error');
        } else {
          showToast('Scenario executed safely. All guardrails upheld!', 'success');
        }
      }
    } catch (err) {
      showToast(`Execution error: ${err.message}`, 'error');
      setIsRunning(false);
    }
  };

  const handleFixAndRerun = async () => {
    await applyFixToSelectedAgent();
    // Re-run scenario
    setTimeout(() => {
      handleExecute();
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <Terminal size={15} />
            <span>SANDBOX EXECUTION RUNNER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
            Live Trace & Fault Injection
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute autonomous agents in an isolated mock sandbox with simulated tools and active policy monitors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={14} fill="currentColor" />
            <span>{isRunning ? 'Executing Trace...' : 'Execute In Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Target Scenario & Agent Selector Panel */}
      <Card className="cyber-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">
              Active Agent Under Test:
            </label>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-cyan-400" />
                <span className="text-xs font-bold text-slate-100">{selectedAgent?.name || 'RefundBot'}</span>
              </div>
              <Badge variant={selectedAgent?.status === 'Hardened' ? 'safe' : 'warning'} size="sm">
                {selectedAgent?.status || 'Active'}
              </Badge>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">
              Select Test Scenario:
            </label>
            <select
              value={selectedScenario?.id || ''}
              onChange={(e) => {
                const found = scenarios.find(s => s.id === e.target.value);
                if (found) setSelectedScenario(found);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {scenarios.map((scen) => (
                <option key={scen.id} value={scen.id}>
                  [{scen.severity}] {scen.title} ({scen.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedScenario && (
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                Injected Scenario Prompt:
              </span>
              <span className="font-mono text-slate-500 text-[10px]">
                Difficulty: {selectedScenario.difficulty}
              </span>
            </div>
            <p className="text-slate-200 font-mono text-xs">
              "{selectedScenario.initialUserRequest}"
            </p>
          </div>
        )}
      </Card>

      {/* Trace Stream Visualizer & Real-time Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trace Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                Execution Trace Stream
              </h3>
            </div>

            <PlaybackControls
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              onReplay={handleExecute}
              isRunning={isRunning}
            />
          </div>

          <TraceTimeline
            traceEvents={visibleEvents}
            isStreaming={isRunning}
          />
        </div>

        {/* Live Diagnostics & Action Panel (1 col) */}
        <div className="space-y-4">
          {/* Outcome Status Card */}
          <Card
            className="space-y-4"
            danger={runResult && runResult.status === 'FAILED'}
            success={runResult && runResult.status === 'PASSED'}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Evaluation Outcome
              </div>
              {runResult && (
                <Badge variant={runResult.status === 'PASSED' ? 'safe' : 'critical'} size="md">
                  {runResult.status}
                </Badge>
              )}
            </div>

            {runResult ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Reliability Score:</span>
                  <span className={`text-lg font-bold ${
                    runResult.reliabilityScore >= 90 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {runResult.reliabilityScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Execution Time:</span>
                  <span className="text-slate-200">{runResult.executionTimeMs}ms</span>
                </div>

                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Failures Detected:</span>
                  <span className="font-bold text-rose-400">
                    {runResult.failuresDetected?.length || 0}
                  </span>
                </div>

                {runResult.failuresDetected && runResult.failuresDetected.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert size={14} />
                      <span>{runResult.failuresDetected[0].title}</span>
                    </div>
                    <p className="text-[11px] text-rose-300/90">
                      {runResult.failuresDetected[0].description || runResult.failuresDetected[0].message}
                    </p>
                  </div>
                )}

                {/* Autopsy & Fix Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => navigate('/autopsy')}
                    className="w-full py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Skull size={14} />
                    <span>Inspect Forensic Autopsy</span>
                  </button>

                  {runResult.status === 'FAILED' && (
                    <button
                      onClick={handleFixAndRerun}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <Wrench size={14} />
                      <span>Apply Fix & Re-Run (68 → 94)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Click "Execute In Sandbox" to start the test run and observe real-time policy detection.
              </div>
            )}
          </Card>

          {/* Sandboxed Tools Available */}
          <Card className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Sandboxed Mock Tools:
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {[
                { name: 'getOrder()', perm: 'READ', safe: true },
                { name: 'verifyCustomer()', perm: 'READ', safe: true },
                { name: 'issueRefund()', perm: 'SENSITIVE', danger: true },
                { name: 'sendEmail()', perm: 'WRITE', safe: true },
                { name: 'searchDatabase()', perm: 'READ', safe: true },
              ].map((t) => (
                <div key={t.name} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-200">{t.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    t.danger ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.perm}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
