const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// 1. Load environment variables before dependent configurations
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./src/config/db');
const voucherRoutes = require('./src/routes/voucherRoutes');
const errorHandler = require('./src/middleware/errorHandler');

// 2. Validate essential environment configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destin_cabs';
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// 3. Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 4. CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 5. Rate limiting for API write requests
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// 6. Body parsers with support for base64 digital signatures
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Comprehensive Health Check Endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(isDbConnected ? 200 : 503).json({
    application: 'DESTIN CABS Trip Voucher Management System',
    company: 'DESTIN PRIVATE LIMITED',
    status: isDbConnected ? 'healthy' : 'unhealthy',
    api: 'online',
    database: {
      status: dbStatusMap[mongoose.connection.readyState] || 'unknown',
      connected: isDbConnected
    },
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 8. Mount Voucher API routes
app.use('/api/vouchers', writeLimiter, voucherRoutes);

// 9. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
});

// 10. Centralized Error Handler
app.use(errorHandler);

// 11. Asynchronous server startup with MongoDB connection and EADDRINUSE safety
let serverInstance = null;

const startServer = async () => {
  try {
    console.log(`[Destin Cabs Server] Initializing in ${NODE_ENV} mode...`);
    
    // Connect to MongoDB
    await connectDB();

    // Start Express listening
    serverInstance = app.listen(PORT, () => {
      console.log(`[Destin Cabs Server] Running on http://127.0.0.1:${PORT}`);
      console.log(`[Destin Cabs Server] Health check available at http://127.0.0.1:${PORT}/api/health`);
    });

    // Handle port in use (EADDRINUSE) and network errors gracefully
    serverInstance.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ [Server Error] Port ${PORT} is already in use by another process.`);
        console.error(`   To free port ${PORT} in PowerShell, run:`);
        console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force\n`);
        process.exit(1);
      } else {
        console.error(`\n❌ [Server Error] ${err.message}\n`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`\n❌ [Fatal Startup Error] ${error.message}\n`);
    process.exit(1);
  }
};

// Graceful termination handling
process.on('SIGINT', () => {
  console.log('\n[Destin Cabs Server] Gracefully shutting down...');
  if (serverInstance) {
    serverInstance.close(() => {
      mongoose.connection.close(false, () => {
        console.log('[Destin Cabs Server] All connections closed. Process terminating.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
  if (serverInstance) {
    serverInstance.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Start the server if this script is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
