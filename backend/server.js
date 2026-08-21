require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Attempt DB connection (falls back gracefully to in-memory store)
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  AGENTX-RAY API & SIMULATION ENGINE STARTED       `);
    console.log(`  Port: ${PORT}                                    `);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Demo Mode: ${process.env.DEMO_MODE !== 'false' ? 'ENABLED (Zero-Key)' : 'LIVE'}`);
    console.log(`====================================================`);
  });

  return server;
};

startServer();
