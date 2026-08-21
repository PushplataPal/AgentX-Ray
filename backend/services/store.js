const { isConnected } = require('../config/db');
const Agent = require('../models/Agent');
const Scenario = require('../models/Scenario');
const TestRun = require('../models/TestRun');
const Failure = require('../models/Failure');
const ReliabilityReport = require('../models/ReliabilityReport');
const {
  DEFAULT_AGENTS,
  DEFAULT_SCENARIOS,
  DEFAULT_FAILURES,
  DEFAULT_RUNS,
  DEFAULT_REPORTS
} = require('./seedData');

// In-Memory Fallback Collections
let inMemoryAgents = JSON.parse(JSON.stringify(DEFAULT_AGENTS));
let inMemoryScenarios = JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));
let inMemoryRuns = JSON.parse(JSON.stringify(DEFAULT_RUNS));
let inMemoryFailures = JSON.parse(JSON.stringify(DEFAULT_FAILURES));
let inMemoryReports = JSON.parse(JSON.stringify(DEFAULT_REPORTS));

class UnifiedStore {
  // --- AGENTS ---
  async getAgents() {
    if (isConnected()) {
      try {
        const list = await Agent.find().lean();
        if (list && list.length > 0) return list;
      } catch (err) {
        console.warn('DB Agent query failed, falling back to memory:', err.message);
      }
    }
    return inMemoryAgents;
  }

  async getAgentById(id) {
    if (isConnected()) {
      try {
        const found = await Agent.findOne({ $or: [{ id }, { slug: id }] }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('DB Agent lookup failed, falling back to memory:', err.message);
      }
    }
    return inMemoryAgents.find(a => a.id === id || a.slug === id) || null;
  }

  async createAgent(agentData) {
    if (isConnected()) {
      try {
        const created = await Agent.create(agentData);
        return created.toObject();
      } catch (err) {
        console.warn('DB Agent create failed, falling back to memory:', err.message);
      }
    }
    inMemoryAgents.unshift(agentData);
    return agentData;
  }

  async updateAgent(id, updates) {
    updates.updatedAt = new Date();
    if (isConnected()) {
      try {
        const updated = await Agent.findOneAndUpdate(
          { $or: [{ id }, { slug: id }] },
          { $set: updates },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.warn('DB Agent update failed, falling back to memory:', err.message);
      }
    }
    const idx = inMemoryAgents.findIndex(a => a.id === id || a.slug === id);
    if (idx !== -1) {
      inMemoryAgents[idx] = { ...inMemoryAgents[idx], ...updates };
      return inMemoryAgents[idx];
    }
    return null;
  }

  // --- SCENARIOS ---
  async getScenarios(agentId = null, category = null) {
    if (isConnected()) {
      try {
        const filter = {};
        if (agentId) filter.agentId = agentId;
        if (category) filter.category = category;
        const list = await Scenario.find(filter).lean();
        if (list && list.length > 0) return list;
      } catch (err) {
        console.warn('DB Scenario query failed, falling back to memory:', err.message);
      }
    }
    let res = inMemoryScenarios;
    if (agentId) res = res.filter(s => s.agentId === agentId);
    if (category) res = res.filter(s => s.category === category);
    return res;
  }

  async getScenarioById(id) {
    if (isConnected()) {
      try {
        const found = await Scenario.findOne({ id }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('DB Scenario lookup failed, falling back to memory:', err.message);
      }
    }
    return inMemoryScenarios.find(s => s.id === id) || null;
  }

  async createScenario(scenarioData) {
    if (isConnected()) {
      try {
        const created = await Scenario.create(scenarioData);
        return created.toObject();
      } catch (err) {
        console.warn('DB Scenario create failed, falling back to memory:', err.message);
      }
    }
    inMemoryScenarios.unshift(scenarioData);
    return scenarioData;
  }

  async addScenarios(scenariosArray) {
    if (isConnected()) {
      try {
        await Scenario.insertMany(scenariosArray);
      } catch (err) {
        console.warn('DB Scenario batch insert failed, falling back to memory:', err.message);
      }
    }
    inMemoryScenarios = [...scenariosArray, ...inMemoryScenarios];
    return scenariosArray;
  }

  // --- TEST RUNS ---
  async getRuns(agentId = null) {
    if (isConnected()) {
      try {
        const filter = agentId ? { agentId } : {};
        const list = await TestRun.find(filter).sort({ createdAt: -1 }).lean();
        if (list && list.length > 0) return list;
      } catch (err) {
        console.warn('DB TestRun query failed, falling back to memory:', err.message);
      }
    }
    let list = inMemoryRuns;
    if (agentId) list = list.filter(r => r.agentId === agentId);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getRunById(id) {
    if (isConnected()) {
      try {
        const found = await TestRun.findOne({ id }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('DB TestRun lookup failed, falling back to memory:', err.message);
      }
    }
    return inMemoryRuns.find(r => r.id === id) || null;
  }

  async saveRun(runData) {
    if (isConnected()) {
      try {
        const created = await TestRun.create(runData);
        return created.toObject();
      } catch (err) {
        console.warn('DB TestRun create failed, falling back to memory:', err.message);
      }
    }
    inMemoryRuns.unshift(runData);
    return runData;
  }

  // --- FAILURES ---
  async getFailures(agentId = null) {
    if (isConnected()) {
      try {
        const filter = agentId ? { agentId } : {};
        const list = await Failure.find(filter).sort({ timestamp: -1 }).lean();
        if (list && list.length > 0) return list;
      } catch (err) {
        console.warn('DB Failure query failed, falling back to memory:', err.message);
      }
    }
    let list = inMemoryFailures;
    if (agentId) list = list.filter(f => f.agentId === agentId);
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async addFailure(failureData) {
    if (isConnected()) {
      try {
        const created = await Failure.create(failureData);
        return created.toObject();
      } catch (err) {
        console.warn('DB Failure save failed, falling back to memory:', err.message);
      }
    }
    inMemoryFailures.unshift(failureData);
    return failureData;
  }

  // --- REPORTS ---
  async getReports(agentId = null) {
    if (isConnected()) {
      try {
        const filter = agentId ? { agentId } : {};
        const list = await ReliabilityReport.find(filter).sort({ createdAt: -1 }).lean();
        if (list && list.length > 0) return list;
      } catch (err) {
        console.warn('DB Report query failed, falling back to memory:', err.message);
      }
    }
    let list = inMemoryReports;
    if (agentId) list = list.filter(r => r.agentId === agentId);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getReportById(id) {
    if (isConnected()) {
      try {
        const found = await ReliabilityReport.findOne({ id }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('DB Report lookup failed, falling back to memory:', err.message);
      }
    }
    return inMemoryReports.find(r => r.id === id) || null;
  }

  async saveReport(reportData) {
    if (isConnected()) {
      try {
        const created = await ReliabilityReport.create(reportData);
        return created.toObject();
      } catch (err) {
        console.warn('DB Report create failed, falling back to memory:', err.message);
      }
    }
    inMemoryReports.unshift(reportData);
    return reportData;
  }

  // Reset/Re-seed helper
  resetToDefaults() {
    inMemoryAgents = JSON.parse(JSON.stringify(DEFAULT_AGENTS));
    inMemoryScenarios = JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));
    inMemoryRuns = JSON.parse(JSON.stringify(DEFAULT_RUNS));
    inMemoryFailures = JSON.parse(JSON.stringify(DEFAULT_FAILURES));
    inMemoryReports = JSON.parse(JSON.stringify(DEFAULT_REPORTS));
  }
}

module.exports = new UnifiedStore();
