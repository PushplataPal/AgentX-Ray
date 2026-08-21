const mongoose = require('mongoose');

const ReliabilityReportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agentId: { type: String, required: true },
  agentName: { type: String, required: true },
  version: { type: String, default: '1.0.0' },
  overallScore: { type: Number, required: true },
  statusTier: { 
    type: String, 
    default: 'NEEDS_ATTENTION' 
  },
  metrics: { type: Object, default: {} },
  fingerprint: { type: Object, default: {} },
  totalTests: { type: Number, default: 0 },
  passedTests: { type: Number, default: 0 },
  failedTests: { type: Number, default: 0 },
  criticalFailuresCount: { type: Number, default: 0 },
  highFailuresCount: { type: Number, default: 0 },
  mediumFailuresCount: { type: Number, default: 0 },
  topFailures: [{ type: Object }],
  autopsy: { type: Object, default: {} },
  autopsies: [{ type: Object }],
  recommendations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// Delete model if already defined to avoid stale schema cache
if (mongoose.models && mongoose.models.ReliabilityReport) {
  delete mongoose.models.ReliabilityReport;
}

module.exports = mongoose.model('ReliabilityReport', ReliabilityReportSchema);
