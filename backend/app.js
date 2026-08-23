const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const agentRoutes = require('./routes/agentRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const runRoutes = require('./routes/runRoutes');
const failureRoutes = require('./routes/failureRoutes');
const reportRoutes = require('./routes/reportRoutes');
const healthRoutes = require('./routes/healthRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const reliabilityRoutes = require('./routes/reliabilityRoutes');

const app = express();

// Middleware
const allowedOrigins = (
    process.env.CLIENT_URL ||
    "http://localhost:5173"
)
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {

            // Allow requests without Origin
            // such as curl/server-to-server.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("CORS origin not allowed")
            );
        }
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/agents', agentRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/failures', failureRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/reliability', reliabilityRoutes);
app.use('/api', analysisRoutes);

// Health check alias
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Root entrypoint info
app.get('/', (req, res) => {
  res.json({
    name: 'AGENTX-RAY API',
    tagline: 'See how your AI agent thinks, fails, and behaves under pressure.',
    hackathon: 'OOSC 4.0 Hackathon - Problem Statement 4',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/agents',
      '/api/scenarios',
      '/api/runs',
      '/api/failures',
      '/api/reports'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

module.exports = app;
