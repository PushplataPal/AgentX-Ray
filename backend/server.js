require('dotenv').config();

const app = require('./app');

// Ensure PORT is evaluated as a number and never as a literal string
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`[AgentX-Ray] Server listening on ${HOST}:${PORT}`);
  console.log(`[AgentX-Ray] DEMO MODE = ${process.env.DEMO_MODE !== 'false'}`);
});

server.on('error', (err) => {
  console.error('[Server Error]', err);
});

// Non-blocking database connection attempt (MongoDB failure will NOT prevent the server from running in DEMO MODE)
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