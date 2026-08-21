import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Play,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Search
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { TrendChart } from '../components/charts/TrendChart';

export const HistoryPage = () => {
  const { selectedAgent, setLatestRun } = useAgent();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAgent, setFilterAgent] = useState('ALL');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadRuns = async () => {
      try {
        setLoading(true);
        const res = await api.getRuns();
        if (res?.data) {
          setRuns(res.data);
        }
      } catch (err) {
        console.error('Error loading history runs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRuns();
  }, []);

  const filteredRuns = runs.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesAgent = filterAgent === 'ALL' || (r.agentId === filterAgent || r.agentName === filterAgent);
    const matchesSearch = (r.scenarioTitle || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesAgent && matchesSearch;
  });

  const handleInspectRun = (run) => {
    setLatestRun(run);
    navigate(`/execute?scenarioId=${run.scenarioId}`);
  };

  const handleOpenReport = (run) => {
    setLatestRun(run);
    navigate(`/reports`);
  };

  const trendData = runs.slice(0, 10).reverse().map((r, i) => ({
    run: `Run #${i + 1}`,
    score: r.reliabilityScore || 68,
    timestamp: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <HistoryIcon size={15} />
            <span>AUDIT TRAIL & RUN LEDGER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
            Test Execution History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological benchmark history, pass/fail ratios, and score progressions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/execute')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Play size={13} fill="currentColor" />
            <span>Run New Test</span>
          </button>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold uppercase text-slate-300">
            Reliability Score Progression Over Time:
          </div>
          <span className="text-xs text-cyan-400 font-mono">
            {runs.length} Runs Logged (Baseline 68 → Remediated 94)
          </span>
        </div>
        <div className="h-[200px]">
          <TrendChart data={trendData} height={200} />
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search runs by scenario or Run ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Agent filter */}
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Agents</option>
            <option value="agent-refundbot">RefundBot</option>
            <option value="agent-travelplanner">TravelPlanner</option>
            <option value="agent-researchagent">ResearchAgent</option>
          </select>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            {['ALL', 'FAILED', 'PASSED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                  filterStatus === status
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="p-4 font-semibold">Run ID</th>
                <th className="p-4 font-semibold">Agent</th>
                <th className="p-4 font-semibold">Scenario</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Reliability</th>
                <th className="p-4 font-semibold">Execution Time</th>
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-900/50 transition-colors cursor-pointer" onClick={() => handleInspectRun(run)}>
                  <td className="p-4 text-cyan-400 font-bold truncate max-w-[130px]">
                    {run.id}
                  </td>
                  <td className="p-4 text-slate-200 font-semibold">
                    {run.agentName || selectedAgent?.name || 'RefundBot'}
                  </td>
                  <td className="p-4 text-slate-300 font-sans max-w-xs truncate">
                    {run.scenarioTitle}
                  </td>
                  <td className="p-4">
                    <Badge variant={run.status === 'PASSED' ? 'safe' : 'critical'} size="sm">
                      {run.status}
                    </Badge>
                  </td>
                  <td className="p-4 font-bold text-slate-100">
                    <span className={run.reliabilityScore >= 90 ? 'text-emerald-400' : 'text-rose-400'}>
                      {run.reliabilityScore}/100
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {run.executionTimeMs}ms
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleInspectRun(run)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-400 text-[11px] font-bold uppercase transition-colors"
                      >
                        Trace
                      </button>
                      <button
                        onClick={() => handleOpenReport(run)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold uppercase transition-colors"
                      >
                        Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
