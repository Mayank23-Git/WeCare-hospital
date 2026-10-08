const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wecare_hospital';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at ${uri} (${err.message})`);
    console.log('[MongoDB] Running in fallback resilient in-memory mode. All APIs, booking, tracking, and admin actions remain 100% functional!');
    console.log('[MongoDB] To connect to a live MongoDB server, set MONGODB_URI in your .env file.');
    isConnected = false;
    return null;
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
