const mongoose = require('mongoose');

let isConnected = false;
let isFallbackMode = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI && process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI must be configured in production.');
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`MongoDB connection failed: ${error.message}`);
    }
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message}).`);
    console.log('[Database Info] Enabling JSON persistent datastore fallback for development so all APIs work seamlessly without requiring a running MongoDB server.');
    isFallbackMode = true;
    isConnected = true;
  }
};

const getIsFallbackMode = () => isFallbackMode;

module.exports = { connectDB, getIsFallbackMode };
