const mongoose = require('mongoose');

/**
 * Masks credentials in MongoDB URI string for secure error logging
 * @param {string} uri - Raw connection string
 * @returns {string} Masked connection string
 */
const maskUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '[Empty URI]';
  try {
    return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
  } catch (e) {
    return '[Protected URI]';
  }
};

/**
 * Connects to MongoDB (Atlas in Production or Local in Development)
 * @returns {Promise<mongoose.Connection>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destin_cabs';
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for cloud Atlas connections
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: isProduction ? 50 : 10,
      minPoolSize: 2
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Failed to connect to MongoDB cluster at ${maskUri(uri)}`);
    console.error(`[MongoDB Connection Error] Details: ${error.message}`);
    
    if (isProduction) {
      console.error('[MongoDB Atlas Tip] Verify that Network Access (0.0.0.0/0) is configured in Atlas.');
      console.error('[MongoDB Atlas Tip] Verify that the Database User credentials and permissions are correct.');
    } else {
      console.error('[MongoDB Local Tip] Ensure local MongoDB daemon is active on 127.0.0.1:27017.');
    }

    throw error;
  }
};

module.exports = connectDB;
