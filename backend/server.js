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
const HOST = '0.0.0.0'; // Render and cloud container standard
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// 3. Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 4. Production CORS configuration for Render + Vercel
const getCorsOrigins = () => {
  const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  const envOrigins = process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (envOrigins) {
    envOrigins.split(',').forEach((url) => {
      const trimmed = url.trim().replace(/\/+$/, '');
      if (trimmed && !defaultOrigins.includes(trimmed)) {
        defaultOrigins.push(trimmed);
      }
    });
  }

  return defaultOrigins;
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. server-to-server health checks, curl, Render pings)
    if (!origin) return callback(null, true);

    const allowed = getCorsOrigins();

    // Check exact match in configured allowed origins
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    // In production, allow preview deployments on Vercel
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // In non-production, allow any localhost/127.0.0.1 port
    if (NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    console.warn(`[CORS Blocked] Origin: ${origin} not permitted`);
    return callback(new Error(`Origin ${origin} blocked by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Disposition'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Handle preflight for all routes
app.options('*', cors(corsOptions));

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

// 7. Base Welcome Endpoint for Web Service Discovery
app.get('/', (req, res) => {
  res.status(200).json({
    application: 'DESTIN CABS Trip Voucher Management API',
    company: 'DESTIN PRIVATE LIMITED',
    tagline: 'Premium Destination Cab Services',
    healthCheck: '/api/health',
    status: 'online',
    environment: NODE_ENV
  });
});

// 8. Production Health Check Endpoint (Mounted on /api/health and /health)
const healthHandler = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const statusCode = isDbConnected ? 200 : 503;

  res.status(statusCode).json({
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
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// 9. Mount Voucher API routes (Mounted on both /api/vouchers and /vouchers)
app.use('/api/vouchers', writeLimiter, voucherRoutes);
app.use('/vouchers', writeLimiter, voucherRoutes);

// 10. 404 Route Handler (Always JSON)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// 11. Centralized Error Handler
app.use(errorHandler);

// 12. Asynchronous server startup with MongoDB connection and EADDRINUSE safety
let serverInstance = null;

const startServer = async () => {
  try {
    console.log(`[Destin Cabs Server] Initializing in ${NODE_ENV} mode...`);
    
    // Connect to MongoDB
    await connectDB();

    // Start Express listening on 0.0.0.0
    await new Promise((resolve, reject) => {
      serverInstance = app.listen(PORT, HOST, () => {
        console.log(`[Destin Cabs Server] Running on http://${HOST}:${PORT} (${NODE_ENV})`);
        console.log(`[Destin Cabs Server] Health check available at /api/health`);
        resolve(serverInstance);
      });

      serverInstance.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`\n❌ [Server Error] Port ${PORT} is already in use by another process.`);
          console.error(`   To free port ${PORT} in PowerShell, run:`);
          console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force\n`);
        } else {
          console.error(`\n❌ [Server Error] ${err.message}\n`);
        }
        reject(err);
      });
    });

    return serverInstance;
  } catch (error) {
    console.error(`\n❌ [Fatal Startup Error] ${error.message}\n`);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

// Graceful termination handling
process.on('SIGINT', async () => {
  console.log('\n[Destin Cabs Server] Gracefully shutting down...');
  if (serverInstance) {
    serverInstance.close(async () => {
      try {
        await mongoose.connection.close();
        console.log('[Destin Cabs Server] All connections closed. Process terminating.');
      } catch (e) {
        // Ignore
      }
      process.exit(0);
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
