const mongoose = require('mongoose');

const ToolPermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  permission: { 
    type: String, 
    enum: ['READ', 'WRITE', 'EXECUTE', 'SENSITIVE_ACTION'], 
    default: 'READ' 
  },
  riskLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'LOW' 
  },
  parameters: { type: Object, default: {} }
});

const AgentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  systemPrompt: { type: String, required: true },
  primaryGoal: { type: String, required: true },
  riskLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 
    default: 'MEDIUM' 
  },
  tools: [ToolPermissionSchema],
  guardrails: [{ type: String }],
  reliabilityScore: { type: Number, default: 68 },
  status: { 
    type: String, 
    enum: ['Active', 'Needs Attention', 'Degraded', 'Hardened', 'Testing'], 
    default: 'Needs Attention' 
  },
  appliedFixes: [{ type: String }],
  version: { type: String, default: '1.0.0' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agent', AgentSchema);
