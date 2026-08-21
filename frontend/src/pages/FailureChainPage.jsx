import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitMerge,
  Play,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Wrench,
  Brain,
  CheckCircle2,
  Terminal,
  Zap
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const FailureChainPage = () => {
  const { selectedAgent } = useAgent();
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChains = async () => {
      try {
        setLoading(true);
        const res = await api.getScenarios();
        if (res?.data) {
          const multiStep = res.data.filter(s => s.isMultiStepChain && s.chainSteps && s.chainSteps.length > 0);
          setChains(multiStep);
          if (multiStep.length > 0) {
            setSelectedChain(multiStep[0]);
          }
        }
      } catch (err) {
        console.error('Error loading failure chains:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChains();
  }, []);

  const getStepIcon = (type) => {
    switch (type) {
      case 'USER_PROMPT':
        return <MessageSquare size={16} className="text-cyan-400" />;
      case 'TOOL_EVENT':
        return <Wrench size={16} className="text-blue-400" />;
      case 'ADVERSARIAL_INJECTION':
        return <ShieldAlert size={16} className="text-rose-400" />;
      case 'AGENT_DECISION':
        return <Brain size={16} className="text-purple-400" />;
      case 'SYSTEM_FAULT':
        return <AlertTriangle size={16} className="text-amber-400" />;
      default:
        return <Terminal size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <GitMerge size={15} />
            <span>SIGNATURE RED-TEAMING SUITE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
            Multi-Step Failure Chains
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test compounding multi-turn social engineering, tool degradation, and prompt injection sequences.
          </p>
        </div>

        {selectedChain && (
          <button
            onClick={() => navigate(`/execute?scenarioId=${selectedChain.id}`)}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
          >
            <Play size={14} fill="currentColor" />
            <span>Execute Chain in Sandbox</span>
          </button>
        )}
      </div>

      {/* Chain Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedChain(c);
              setActiveStepIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedChain?.id === c.id
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Badge variant={c.severity?.toLowerCase() || 'high'} size="sm">
                {c.severity}
              </Badge>
              <span>{c.title}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedChain && (
        <div className="space-y-6">
          {/* Chain Metadata Banner */}
          <Card className="cyber-card-glow space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={selectedChain.severity?.toLowerCase() || 'critical'} size="md">
                    {selectedChain.severity} SEVERITY
                  </Badge>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Category: {selectedChain.category}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    {selectedChain.chainSteps?.length || 4} Cascaded Steps
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-100">
                  {selectedChain.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedChain.description}
                </p>
              </div>

              <button
                onClick={() => navigate(`/execute?scenarioId=${selectedChain.id}`)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-all flex items-center gap-2"
              >
                <Zap size={14} />
                <span>Launch Test</span>
              </button>
            </div>
          </Card>

          {/* Timeline Visualizer (Horizontal Node Stepper) */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Multi-Step Attack Timeline:
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(selectedChain.chainSteps || []).map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <div
                    key={step.stepNumber || idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-3 relative ${
                      isActive
                        ? 'bg-cyan-950/50 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                          step.type === 'ADVERSARIAL_INJECTION' ? 'bg-rose-950 border-rose-500 text-rose-400' :
                          step.type === 'USER_PROMPT' ? 'bg-cyan-950 border-cyan-500 text-cyan-400' :
                          'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>
                          {getStepIcon(step.type)}
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          Step #{step.stepNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                        {step.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                      {step.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {step.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                      <span>Target: {step.vulnerabilityTarget || 'Policy Check'}</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Step Deep Inspector */}
          {selectedChain.chainSteps && selectedChain.chainSteps[activeStepIndex] && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                    Step #{selectedChain.chainSteps[activeStepIndex].stepNumber} Inspector: {selectedChain.chainSteps[activeStepIndex].title}
                  </h3>
                </div>
                <Badge variant="cyan" size="sm">
                  {selectedChain.chainSteps[activeStepIndex].type}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Step Narrative & Attack Objective:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-lg bg-black/40 border border-slate-800">
                    {selectedChain.chainSteps[activeStepIndex].description}
                  </p>

                  <div className="text-xs font-mono uppercase text-slate-400 font-bold mt-3">
                    Expected Safe Agent Reaction:
                  </div>
                  <p className="text-xs text-emerald-300/90 leading-relaxed p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                    {selectedChain.chainSteps[activeStepIndex].expectedReaction || 'Validate state and halt unauthorized tool execution.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Injected Payload / Tool Event:
                  </div>
                  <pre className="p-3 rounded-lg bg-black/70 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto min-h-[120px]">
                    {JSON.stringify(selectedChain.chainSteps[activeStepIndex].payload || { event: 'SIMULATED_STATE_INSPECTION' }, null, 2)}
                  </pre>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
