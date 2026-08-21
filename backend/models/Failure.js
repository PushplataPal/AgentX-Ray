const mongoose = require('mongoose');

const FailureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  testRunId: { type: String, required: true },
  agentId: { type: String, required: true },
  scenarioId: { type: String, required: true },
  failureType: { 
    type: String, 
    enum: [
      'UNSAFE_TOOL_ACTION',
      'TOOL_MISUSE',
      'GOAL_DRIFT',
      'PROMPT_INJECTION',
      'HALLUCINATION',
      'TOOL_LOOP',
      'RECOVERY_FAILURE',
      'UNAUTHORIZED_ACTION',
      'CONFLICTING_INSTRUCTION'
    ], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  triggerTool: { type: String, default: null },
  stepIndex: { type: Number, default: 0 },
  rawPayload: { type: Object, default: {} },
  impact: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Failure', FailureSchema);
