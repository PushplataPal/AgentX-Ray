import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Health & System
  getHealth: async () => {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, running in local fallback mode:', err.message);
      return { success: true, platform: 'AgentX-Ray (Offline Fallback)', database: { mode: 'In-Memory Demo' } };
    }
  },
  resetDefaults: async () => {
    const res = await client.post('/health/reset');
    return res.data;
  },

  // Agents
  getAgents: async () => {
    const res = await client.get('/agents');
    return res.data;
  },
  getAgentById: async (id) => {
    const res = await client.get(`/agents/${id}`);
    return res.data;
  },
  createAgent: async (data) => {
    const res = await client.post('/agents', data);
    return res.data;
  },
  updateAgent: async (id, data) => {
    const res = await client.put(`/agents/${id}`, data);
    return res.data;
  },
  applyRecommendedFix: async (agentId) => {
    const res = await client.post(`/agents/${agentId}/apply-fix`);
    return res.data;
  },

  // Scenarios
  getScenarios: async (params = {}) => {
    const res = await client.get('/scenarios', { params });
    return res.data;
  },
  getScenarioById: async (id) => {
    const res = await client.get(`/scenarios/${id}`);
    return res.data;
  },
  generateScenarios: async (data) => {
    const res = await client.post('/scenarios/generate', data);
    return res.data;
  },
  createScenario: async (data) => {
    const res = await client.post('/scenarios', data);
    return res.data;
  },

  // Test Runs
  getRuns: async (params = {}) => {
    const res = await client.get('/runs', { params });
    return res.data;
  },
  getRunById: async (id) => {
    const res = await client.get(`/runs/${id}`);
    return res.data;
  },
  executeRun: async (data) => {
    const res = await client.post('/runs', data);
    return res.data;
  },

  // Failures, Fingerprints & Autopsy
  getFailures: async (params = {}) => {
    const res = await client.get('/failures', { params });
    return res.data;
  },
  getFailureFingerprint: async (agentId) => {
    const res = await client.get(`/failures/fingerprint/${agentId}`);
    return res.data;
  },
  analyzeExecution: async (data) => {
    const res = await client.post('/analyze', data);
    return res.data;
  },
  generateAutopsy: async (data) => {
    const res = await client.post('/autopsy', data);
    return res.data;
  },

  // Reliability Score Engine
  calculateReliability: async (data) => {
    const res = await client.post('/reliability/calculate', data);
    return res.data;
  },
  getAgentReliability: async (agentId) => {
    const res = await client.get(`/reliability/${agentId}`);
    return res.data;
  },
  rerunTest: async (runId) => {
    const res = await client.post(`/runs/${runId}/rerun`);
    return res.data;
  },

  // Reports
  getReports: async (params = {}) => {
    const res = await client.get('/reports', { params });
    return res.data;
  },
  getReportById: async (id) => {
    const res = await client.get(`/reports/${id}`);
    return res.data;
  },
  generateReport: async (agentId) => {
    const res = await client.post('/reports/generate', { agentId });
    return res.data;
  }
};
