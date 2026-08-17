const mongoose = require('mongoose');

let isConnected = false;
let isFallbackMode = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/savrion';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message}).`);
    console.log('[Database Info] Enabling JSON persistent datastore fallback for development so all APIs work seamlessly without requiring a running MongoDB server.');
    isFallbackMode = true;
    isConnected = true;
  }
};

const getIsFallbackMode = () => isFallbackMode;

module.exports = { connectDB, getIsFallbackMode };
