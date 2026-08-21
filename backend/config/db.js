const mongoose = require('mongoose');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agentxray';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    useMemoryStore = true;
    console.warn(`[Database] MongoDB not reachable (${error.message}).`);
    console.log(`[Database] Running in Resilience Mode (High-Speed In-Memory & Demo Storage).`);
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  usingFallback: useMemoryStore,
  mode: isConnected ? 'MongoDB (Persistent)' : 'In-Memory Store (Resilient Demo Mode)'
});

module.exports = { connectDB, getDBStatus, isConnected: () => isConnected };
