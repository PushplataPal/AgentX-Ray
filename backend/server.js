require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

console.log(`[AgentX-Ray] Starting server...`);
console.log(`[AgentX-Ray] PORT = ${PORT}`);
console.log(`[AgentX-Ray] HOST = ${HOST}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 AgentX-Ray server is listening on ${HOST}:${PORT}`);
  console.log(`✅ DEMO MODE = ${process.env.DEMO_MODE !== 'false'}`);
});

server.on('error', (err) => {
  console.error('[Server Error]', err);
});

// MongoDB must NEVER block server startup.
try {
  const { connectDB } = require('./config/db');

  connectDB()
    .then(() => {
      console.log('[Database] MongoDB connected.');
    })
    .catch((err) => {
      console.warn(
        '[Database] MongoDB unavailable. Continuing in DEMO/RESILIENCE MODE:',
        err.message
      );
    });
} catch (err) {
  console.warn('[Database] DB module unavailable. Continuing in DEMO MODE.');
}

module.exports = server;