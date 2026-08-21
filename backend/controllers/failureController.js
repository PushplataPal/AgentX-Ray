const store = require('../services/store');
const scoringEngine = require('../services/scoringEngine');

exports.getFailures = async (req, res) => {
  try {
    const { agentId } = req.query;
    const failures = await store.getFailures(agentId);
    res.json({ success: true, count: failures.length, data: failures });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFailureFingerprint = async (req, res) => {
  try {
    const agentId = req.params.agentId || 'agent-refundbot';
    const agent = await store.getAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }

    const failures = await store.getFailures(agent.id);
    const runs = await store.getRuns(agent.id);
    const latestRun = runs[0];
    const metrics = latestRun?.metrics || {
      taskAccuracy: 70,
      toolSafety: 48,
      goalAdherence: 75,
      attackResistance: 52,
      recoveryAbility: 65
    };

    const fingerprint = scoringEngine.generateFingerprint(agent, failures, metrics);

    res.json({
      success: true,
      agentId: agent.id,
      agentName: agent.name,
      fingerprint
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
