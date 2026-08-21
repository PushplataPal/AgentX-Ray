import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Play,
  Filter,
  ShieldAlert,
  AlertTriangle,
  GitMerge,
  Search,
  CheckSquare,
  Square,
  RefreshCw,
  Plus,
  Eye,
  X,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const ScenarioGeneratorPage = () => {
  const { selectedAgent, showToast } = useAgent();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [inspectScenario, setInspectScenario] = useState(null);

  // Generator Options
  const [genCount, setGenCount] = useState(10);
  const [genDifficulty, setGenDifficulty] = useState('All');
  const [selectedGenCategories, setSelectedGenCategories] = useState([
    'Unsafe Action',
    'Prompt Injection',
    'Goal Drift',
    'Tool Misuse',
    'Hallucination',
    'Tool Loop',
    'Recovery Failure',
    'Multi-turn Manipulation'
  ]);

  const navigate = useNavigate();

  const categories = [
    'Unsafe Action',
    'Prompt Injection',
    'Goal Drift',
    'Tool Misuse',
    'Hallucination',
    'Tool Loop',
    'Recovery Failure',
    'Multi-turn Manipulation'
  ];

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const res = await api.getScenarios();
      if (res?.data) {
        setScenarios(res.data);
      }
    } catch (err) {
      console.error('Error fetching scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await api.generateScenarios({
        agentId: selectedAgent?.id || 'agent-refundbot',
        count: genCount,
        difficulty: genDifficulty,
        categories: selectedGenCategories
      });
      if (res?.data) {
        setScenarios(prev => [...res.data, ...prev]);
        showToast(`Successfully generated ${res.count} adversarial scenarios!`, 'success');
      }
    } catch (err) {
      showToast(`Generation failed: ${err.message}`, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const toggleGenCategory = (cat) => {
    if (selectedGenCategories.includes(cat)) {
      setSelectedGenCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedGenCategories(prev => [...prev, cat]);
    }
  };

  const filteredScenarios = scenarios.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;
    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <Layers size={15} />
            <span>ADVERSARIAL SCENARIO SYNTHESIZER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
            Scenario Generation Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesize normal, edge-case, and red-teaming adversarial scenarios across 8 failure categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chains')}
            className="px-4 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider hover:bg-cyan-900/60 transition-all flex items-center gap-2"
          >
            <GitMerge size={14} />
            <span>Explore Failure Chains</span>
          </button>
        </div>
      </div>

      {/* Generator Control Panel */}
      <Card className="cyber-card-glow space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono text-cyan-400">
            <Sparkles size={16} />
            <span>Adversarial Scenario Generator Engine</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Target: <strong className="text-slate-200">{selectedAgent?.name || 'RefundBot'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Scenario Count Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">
              Scenario Batch Count:
            </label>
            <div className="flex items-center gap-2">
              {[10, 20, 30, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => setGenCount(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    genCount === num
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">
              Attack Difficulty:
            </label>
            <select
              value={genDifficulty}
              onChange={(e) => setGenDifficulty(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Difficulties (Mixed)</option>
              <option value="Easy">Easy (Single Prompt)</option>
              <option value="Medium">Medium (Ambiguity & Missing Data)</option>
              <option value="Hard">Hard (Adversarial Pressure)</option>
              <option value="Extreme">Extreme (Multi-Step Jailbreak)</option>
            </select>
          </div>

          {/* Trigger Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>{generating ? 'Synthesizing...' : `Generate ${genCount} Scenarios`}</span>
            </button>
          </div>
        </div>

        {/* Category Checkboxes */}
        <div className="pt-2">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2">
            Targeted Failure Categories:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const active = selectedGenCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleGenCategory(cat)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all border ${
                    active
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {active ? <CheckSquare size={14} className="text-cyan-400 shrink-0" /> : <Square size={14} className="shrink-0" />}
                  <span className="truncate">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scenarios by keyword or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Extreme">Extreme</option>
          </select>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScenarios.map((scen) => (
          <Card
            key={scen.id}
            className="space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-all group cursor-pointer"
            onClick={() => setInspectScenario(scen)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={scen.severity?.toLowerCase() || 'medium'} size="sm">
                    {scen.severity || 'MEDIUM'}
                  </Badge>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {scen.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {scen.difficulty}
                  </span>
                  {scen.isMultiStepChain && (
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      MULTI-STEP CHAIN
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {scen.id}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {scen.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2">
                {scen.description}
              </p>

              {/* Initial user prompt box */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-[10px] text-cyan-400 uppercase font-semibold">User Request:</div>
                <div className="line-clamp-2 text-slate-200">"{scen.initialUserRequest}"</div>
              </div>

              {/* Potential Failure Mode */}
              <div className="text-xs text-rose-400/90 font-mono flex items-start gap-1.5 pt-1">
                <ShieldAlert size={13} className="shrink-0 mt-0.5 text-rose-400" />
                <span className="line-clamp-1">Failure Risk: {scen.potentialFailureMode}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setInspectScenario(scen)}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                <Eye size={13} />
                <span>Inspect Scenario Details</span>
              </button>

              <button
                onClick={() => navigate(`/execute?scenarioId=${scen.id}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <Play size={12} fill="currentColor" />
                <span>Execute In Sandbox</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Scenario Detail Modal / Drawer */}
      {inspectScenario && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={inspectScenario.severity?.toLowerCase() || 'medium'} size="md">
                    {inspectScenario.severity}
                  </Badge>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{inspectScenario.category}</span>
                  <span className="text-xs font-mono text-slate-400">({inspectScenario.difficulty})</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">{inspectScenario.title}</h2>
              </div>
              <button onClick={() => setInspectScenario(null)} className="p-1 text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-mono text-slate-400 uppercase font-bold text-[10px]">Description:</span>
                <p className="text-slate-300">{inspectScenario.description}</p>
              </div>

              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-1 font-mono">
                <span className="text-cyan-400 uppercase font-bold text-[10px]">Initial User Request:</span>
                <p className="text-slate-200">"{inspectScenario.initialUserRequest}"</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 uppercase font-bold text-[10px] font-mono">Expected Safe Behaviour:</span>
                  <p className="text-slate-300">{inspectScenario.expectedSafeBehaviour}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-rose-400 uppercase font-bold text-[10px] font-mono">Potential Failure Mode:</span>
                  <p className="text-slate-300">{inspectScenario.potentialFailureMode}</p>
                </div>
              </div>

              {/* Multi-step Chain Steps if present */}
              {inspectScenario.chainSteps && inspectScenario.chainSteps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="font-mono text-cyan-400 uppercase font-bold text-[10px] block">
                    Multi-Step Attack Sequence ({inspectScenario.chainSteps.length} Steps):
                  </span>
                  <div className="space-y-2">
                    {inspectScenario.chainSteps.map((step) => (
                      <div key={step.stepNumber} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <div className="text-xs font-bold text-slate-200">{step.title}</div>
                          <p className="text-slate-400 text-[11px]">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setInspectScenario(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectScenario(null);
                  navigate(`/execute?scenarioId=${inspectScenario.id}`);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Play size={12} fill="currentColor" />
                <span>Execute Scenario</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
