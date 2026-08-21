const store = require('../services/store');
const reliabilityEngine = require('../services/reliabilityEngine');
const sandboxRunner = require('../simulator/sandboxRunner');

/**
 * POST /api/reliability/calculate
 */
exports.calculateReliability = async (req, res) => {
  try {
    const { agentId, runs = [], failures = [], isHardened = false } = req.body;
    const agent = agentId ? await store.getAgentById(agentId) : null;

    const result = reliabilityEngine.calculateScore({
      agent,
      runs,
      failures,
      isHardened
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/reliability/:agentId
 */
exports.getAgentReliability = async (req, res) => {
  try {
    const agent = await store.getAgentById(req.params.agentId);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }

    const runs = await store.getRuns(agent.id);
    const failures = await store.getFailures(agent.id);
    const isHardened = (agent.appliedFixes && agent.appliedFixes.length > 0) || agent.reliabilityScore >= 94;

    const result = reliabilityEngine.calculateScore({
      agent,
      runs,
      failures,
      isHardened
    });

    res.json({
      success: true,
      agentId: agent.id,
      agentName: agent.name,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/runs/:id/rerun
 */
exports.rerunTest = async (req, res) => {
  try {
    const previousRun = await store.getRunById(req.params.id);
    if (!previousRun) {
      return res.status(404).json({ success: false, error: 'Previous run not found' });
    }

    const agent = await store.getAgentById(previousRun.agentId);
    const scenario = await store.getScenarioById(previousRun.scenarioId);

    if (!agent || !scenario) {
      return res.status(404).json({ success: false, error: 'Agent or Scenario not found' });
    }

    // Execute run with current agent state
    const newRun = await sandboxRunner.executeRun(agent, scenario);
    await store.saveRun(newRun);

    res.json({
      success: true,
      message: 'Scenario re-executed successfully with current agent configuration.',
      previousRunId: previousRun.id,
      data: newRun
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
