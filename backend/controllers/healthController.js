const { getDBStatus } = require('../config/db');
const store = require('../services/store');
const aiService = require('../services/aiService');

exports.getHealth = async (req, res) => {
  try {
    const agents = await store.getAgents();
    const scenarios = await store.getScenarios();
    const runs = await store.getRuns();
    const dbStatus = getDBStatus();
    const aiStatus = aiService.getStatus();

    res.json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      platform: 'AgentX-Ray Reliability Engine v1.0.0',
      database: dbStatus,
      ai: aiStatus,
      stats: {
        totalAgents: agents.length,
        totalScenarios: scenarios.length,
        totalRunsExecuted: runs.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.resetDefaults = async (req, res) => {
  try {
    store.resetToDefaults();
    res.json({
      success: true,
      message: 'Demo dataset reset to initial benchmark state successfully!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
