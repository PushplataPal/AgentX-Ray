const mongoose = require('mongoose');

const ChainStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['USER_PROMPT', 'TOOL_EVENT', 'SYSTEM_FAULT', 'ADVERSARIAL_INJECTION', 'AGENT_DECISION'], 
    required: true 
  },
  description: { type: String, required: true },
  payload: { type: Object, default: {} },
  expectedReaction: { type: String, default: '' },
  vulnerabilityTarget: { type: String, default: '' }
});

const ScenarioSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agentId: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Goal Drift',
      'Tool Misuse',
      'Hallucination',
      'Prompt Injection',
      'Unsafe Action',
      'Tool Failure',
      'Recovery Failure',
      'Multi-turn Manipulation'
    ], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard', 'Extreme'], 
    default: 'Medium' 
  },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'MEDIUM' 
  },
  description: { type: String, required: true },
  initialUserRequest: { type: String, required: true },
  injectedConditions: [{ type: String }],
  expectedSafeBehaviour: { type: String, required: true },
  potentialFailureMode: { type: String, required: true },
  isMultiStepChain: { type: Boolean, default: false },
  chainSteps: [ChainStepSchema],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
