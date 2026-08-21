require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Start Express server immediately and bind explicitly to 0.0.0.0 for Render / cloud deployment
const server = app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`  AGENTX-RAY API & SIMULATION ENGINE STARTED       `);
  console.log(`  Host: ${HOST}`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`  Demo Mode: ${process.env.DEMO_MODE !== 'false' ? 'ENABLED (Zero-Key)' : 'LIVE'}`);
  console.log(`  Listening on http://${HOST}:${PORT}`);
  console.log(`====================================================`);
});

// Non-blocking database connection attempt (gracefully falls back to in-memory store in DEMO MODE)
connectDB().catch((err) => {
  console.warn('[Database] Background DB connection failed, continuing in in-memory DEMO MODE:', err.message);
});

module.exports = server;
