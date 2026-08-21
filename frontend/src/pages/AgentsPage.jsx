import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Save,
  Check,
  FileCode,
  Key,
  Flame,
  Info
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const AgentsPage = () => {
  const { agents, selectedAgent, setSelectedAgent, fetchAgents, showToast } = useAgent();
  const [formData, setFormData] = useState(selectedAgent || {});
  const [saving, setSaving] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', permission: 'READ', riskLevel: 'LOW', description: '' });
  const [newGuardrail, setNewGuardrail] = useState('');

  // Update local form state when selected agent changes
  React.useEffect(() => {
    if (selectedAgent) {
      setFormData(JSON.parse(JSON.stringify(selectedAgent)));
    }
  }, [selectedAgent]);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleAddTool = () => {
    if (!newTool.name) {
      showToast('Please enter a tool name.', 'error');
      return;
    }
    const tools = [...(formData.tools || []), { ...newTool }];
    setFormData(prev => ({ ...prev, tools }));
    setNewTool({ name: '', permission: 'READ', riskLevel: 'LOW', description: '' });
    showToast(`Added tool "${newTool.name}" to configuration.`, 'success');
  };

  const handleRemoveTool = (index) => {
    const tools = formData.tools.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, tools }));
  };

  const handleAddGuardrail = () => {
    if (!newGuardrail) return;
    const guardrails = [...(formData.guardrails || []), newGuardrail];
    setFormData(prev => ({ ...prev, guardrails }));
    setNewGuardrail('');
  };

  const handleRemoveGuardrail = (index) => {
    const guardrails = formData.guardrails.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, guardrails }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.systemPrompt || !formData.primaryGoal) {
      showToast('Please fill in required fields (Name, Goal, System Prompt).', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await api.updateAgent(formData.id, formData);
      if (res && res.data) {
        setSelectedAgent(res.data);
        await fetchAgents();
        showToast('Agent configuration updated successfully!', 'success');
      }
    } catch (err) {
      showToast(`Error updating agent: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            <Bot size={15} />
            <span>AGENT SPECIFICATION & GOVERNANCE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
            Agent Configuration & Guardrails
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure agent identity, registered tool permissions, system prompts, and safety constraints.
          </p>
        </div>

        {/* Agent Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {agents.map((ag) => (
            <button
              key={ag.id}
              onClick={() => setSelectedAgent(ag)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedAgent?.id === ag.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ag.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
                Agent Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
                Risk Level
              </label>
              <select
                value={formData.riskLevel || 'MEDIUM'}
                onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="LOW">LOW RISK</option>
                <option value="MEDIUM">MEDIUM RISK</option>
                <option value="HIGH">HIGH RISK</option>
                <option value="CRITICAL">CRITICAL RISK</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </Card>

          {/* Primary Goal & System Prompt */}
          <Card className="md:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center justify-between">
                <span>Primary Goal *</span>
                <span className="text-[10px] text-cyan-400 normal-case">Used for goal drift detection</span>
              </label>
              <input
                type="text"
                value={formData.primaryGoal || ''}
                onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Process customer refunds safely and verify identities."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center justify-between">
                <span>System Prompt Directive *</span>
                <span className="text-[10px] text-slate-400 font-mono">Governs agent reasoning</span>
              </label>
              <textarea
                rows={6}
                value={formData.systemPrompt || ''}
                onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
                required
              />
            </div>
          </Card>
        </div>

        {/* Visual Tool Permission Panel */}
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2 font-mono">
                <Key size={16} className="text-cyan-400" />
                <span>Tool Registry & Permissions</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Actions flagged as SENSITIVE ACTION trigger strict security guardrail verifications.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {(formData.tools || []).length} Tools Registered
            </span>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(formData.tools || []).map((tool, idx) => {
              const isSensitive = tool.permission === 'SENSITIVE_ACTION' || tool.name === 'issueRefund';
              return (
                <div
                  key={tool.name || idx}
                  className={`p-4 rounded-xl border relative space-y-3 ${
                    isSensitive 
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-100">
                        {tool.name}()
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove Tool"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {tool.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider ${
                      isSensitive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                      tool.permission === 'WRITE' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {tool.permission}
                    </span>

                    <Badge variant={tool.riskLevel?.toLowerCase() || 'low'} size="sm">
                      {tool.riskLevel || 'LOW'}
                    </Badge>
                  </div>

                  {isSensitive && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-semibold bg-rose-950/60 p-1.5 rounded border border-rose-500/30">
                      <AlertTriangle size={12} className="text-rose-400 shrink-0" />
                      <span>Sensitive action: Identity verification required!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Tool Form */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-slate-300">
              Register Additional Tool:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Tool Name (e.g. transferFunds)"
                value={newTool.name}
                onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <select
                value={newTool.permission}
                onChange={(e) => setNewTool(prev => ({ ...prev, permission: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="READ">READ (Query only)</option>
                <option value="WRITE">WRITE (State update)</option>
                <option value="EXECUTE">EXECUTE (Computation)</option>
                <option value="SENSITIVE_ACTION">SENSITIVE ACTION (High Risk)</option>
              </select>
              <select
                value={newTool.riskLevel}
                onChange={(e) => setNewTool(prev => ({ ...prev, riskLevel: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
              <button
                type="button"
                onClick={handleAddTool}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-1 transition-all"
              >
                <Plus size={14} />
                <span>Add Tool</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Safety Rules Section */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                Safety Rules & Guardrail Policies
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              POLICY ENFORCEMENT
            </span>
          </div>

          <div className="space-y-3">
            {/* RefundBot Primary Safety Rule */}
            {formData.id === 'agent-refundbot' && (() => {
              const isRuleActive = (formData.guardrails || []).some(g => g.toLowerCase().includes('never call issuerefund without customer verification')) ||
                (formData.appliedFixes || []).length > 0;
              
              const toggleRefundRule = () => {
                const ruleText = 'Never call issueRefund without customer verification';
                let newGuardrails = [...(formData.guardrails || [])];
                let newFixes = [...(formData.appliedFixes || [])];
                let newScore = formData.reliabilityScore;
                
                if (isRuleActive) {
                  newGuardrails = newGuardrails.filter(g => !g.toLowerCase().includes('never call issuerefund without customer verification'));
                  newFixes = [];
                  newScore = 68;
                  showToast('Safety rule disabled (Baseline 68/100).', 'info');
                } else {
                  if (!newGuardrails.includes(ruleText)) newGuardrails.push(ruleText);
                  newFixes = ['Enforce mandatory customer identity verification before issueRefund() execution'];
                  newScore = 94;
                  showToast('Safety rule enabled (Hardened 94/100).', 'success');
                }
                
                setFormData(prev => ({
                  ...prev,
                  guardrails: newGuardrails,
                  appliedFixes: newFixes,
                  reliabilityScore: newScore,
                  status: newScore >= 94 ? 'Hardened' : 'Needs Attention'
                }));
              };

              return (
                <div
                  onClick={toggleRefundRule}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isRuleActive
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isRuleActive}
                      onChange={toggleRefundRule}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100 font-mono">
                        Never call issueRefund without customer verification
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Blocks sensitive refund actions unless customerVerified === true.
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase ${
                    isRuleActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isRuleActive ? '☑ ENFORCED (94/100)' : '☐ DISABLED (68/100)'}
                  </span>
                </div>
              );
            })()}

            {/* General Policy Rule */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={true} readOnly className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-cyan-500 cursor-not-allowed" />
                <span className="text-slate-200 font-mono">Disallow direct raw DDL/DML SQL execution (DROP/DELETE/TRUNCATE)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
          </div>
        </Card>

        {/* Guardrails List */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                Active Guardrails & Invariants
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {(formData.guardrails || []).length} Guardrails
            </span>
          </div>

          <div className="space-y-2">
            {(formData.guardrails || []).map((guard, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-200">{guard}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGuardrail(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Enforce 2FA verification before sensitive tool dispatch"
              value={newGuardrail}
              onChange={(e) => setNewGuardrail(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={handleAddGuardrail}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Add Guardrail
            </button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Agent Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
