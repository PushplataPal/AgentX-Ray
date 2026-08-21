import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestRun, setLatestRun] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.getAgents();
      if (res && res.data) {
        setAgents(res.data);
        if (!selectedAgent && res.data.length > 0) {
          // Default to RefundBot for hackathon demo
          const refundBot = res.data.find(a => a.id === 'agent-refundbot') || res.data[0];
          setSelectedAgent(refundBot);
        } else if (selectedAgent) {
          const updated = res.data.find(a => a.id === selectedAgent.id);
          if (updated) setSelectedAgent(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const selectAgentById = (id) => {
    const found = agents.find(a => a.id === id);
    if (found) setSelectedAgent(found);
  };

  const applyFixToSelectedAgent = async () => {
    if (!selectedAgent) return;
    try {
      const res = await api.applyRecommendedFix(selectedAgent.id);
      if (res && res.data) {
        setSelectedAgent(res.data);
        setAgents(prev => prev.map(a => a.id === res.data.id ? res.data : a));
        showToast('Hardened verification guardrail applied! Reliability score improved to 94/100.', 'success');
        return res;
      }
    } catch (err) {
      showToast(`Failed to apply fix: ${err.message}`, 'error');
    }
  };

  return (
    <AgentContext.Provider
      value={{
        agents,
        selectedAgent,
        setSelectedAgent,
        selectAgentById,
        loading,
        error,
        fetchAgents,
        latestRun,
        setLatestRun,
        demoMode,
        setDemoMode,
        applyFixToSelectedAgent,
        showToast,
        toast
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-lg shadow-xl border backdrop-blur-md text-sm font-medium flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-slate-900/90 border-cyan-500/50 text-cyan-200'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
            {toast.message}
          </div>
        </div>
      )}
    </AgentContext.Provider>
  );
};

export const useAgent = () => useContext(AgentContext);
