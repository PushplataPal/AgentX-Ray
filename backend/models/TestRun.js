const mongoose = require('mongoose');

const TraceEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  stepNumber: { type: Number, required: true },
  eventType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'NEUTRAL' },
  toolName: { type: String, default: null },
  inputParams: { type: Object, default: {} },
  outputResult: { type: Object, default: {} },
  violationDetails: { type: Object, default: null },
  durationMs: { type: Number, default: 0 }
});

const TestRunSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agentId: { type: String, required: true },
  agentName: { type: String, required: true },
  scenarioId: { type: String, required: true },
  scenarioTitle: { type: String, required: true },
  scenarioCategory: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['QUEUED', 'RUNNING', 'PASSED', 'FAILED', 'ERROR'], 
    default: 'RUNNING' 
  },
  executionTimeMs: { type: Number, default: 0 },
  traceEvents: [TraceEventSchema],
  failuresDetected: [{ type: Object }],
  autopsy: { type: Object, default: null },
  reliabilityScore: { type: Number, default: 0 },
  grade: { type: String, default: 'Needs Attention' },
  metrics: {
    taskAccuracy: { type: Number, default: 0 },
    toolSafety: { type: Number, default: 0 },
    goalAdherence: { type: Number, default: 0 },
    attackResistance: { type: Number, default: 0 },
    recoveryAbility: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestRun', TestRunSchema);
