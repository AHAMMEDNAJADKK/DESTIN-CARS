const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destin_cabs';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Failed to connect to MongoDB at "${uri}".`);
    console.error(`[MongoDB Connection Error] Details: ${error.message}`);
    console.error('[MongoDB Connection Error] Please verify that your MongoDB service is running.');
    process.exit(1);
  }
};

module.exports = connectDB;
