const store = require('../services/store');
const scenarioGenerator = require('../services/scenarioGenerator');
const { v4: uuidv4 } = require('uuid');

exports.getScenarios = async (req, res) => {
  try {
    const { agentId, category } = req.query;
    const scenarios = await store.getScenarios(agentId, category);
    res.json({ success: true, count: scenarios.length, data: scenarios });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getScenarioById = async (req, res) => {
  try {
    const scenario = await store.getScenarioById(req.params.id);
    if (!scenario) {
      return res.status(404).json({ success: false, error: 'Scenario not found' });
    }
    res.json({ success: true, data: scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.generateScenarios = async (req, res) => {
  try {
    const { agentId, count, difficulty, categories } = req.body;
    const generated = scenarioGenerator.generateScenarios({
      agentId: agentId || 'agent-refundbot',
      count: parseInt(count, 10) || 10,
      difficulty: difficulty || 'All',
      categories: categories || []
    });
    
    await store.addScenarios(generated);
    res.status(201).json({
      success: true,
      message: `Generated ${generated.length} scenarios successfully!`,
      count: generated.length,
      data: generated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createScenario = async (req, res) => {
  try {
    const {
      agentId,
      title,
      category,
      difficulty,
      severity,
      description,
      initialUserRequest,
      injectedConditions,
      expectedSafeBehaviour,
      potentialFailureMode,
      isMultiStepChain,
      chainSteps,
      tags
    } = req.body;

    const newScenario = {
      id: `scen-${uuidv4().substring(0, 8)}`,
      agentId: agentId || 'agent-refundbot',
      title,
      category: category || 'Unsafe Action',
      difficulty: difficulty || 'Medium',
      severity: severity || 'MEDIUM',
      description,
      initialUserRequest,
      injectedConditions: injectedConditions || [],
      expectedSafeBehaviour: expectedSafeBehaviour || '',
      potentialFailureMode: potentialFailureMode || '',
      isMultiStepChain: Boolean(isMultiStepChain),
      chainSteps: chainSteps || [],
      tags: tags || [],
      createdAt: new Date()
    };

    const created = await store.createScenario(newScenario);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
