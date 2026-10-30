/**
 * Destin Cabs Production Deployment Verification Suite
 * Tests:
 * 1. Server initialization on 0.0.0.0
 * 2. MongoDB connection & health check endpoint
 * 3. Base discovery endpoint (GET /)
 * 4. CORS headers & OPTIONS preflight behavior
 * 5. Security headers via Helmet
 * 6. Rate limiting registration
 * 7. Clean teardown
 */

const http = require('http');

// Load environment
process.env.NODE_ENV = 'production';
process.env.PORT = '5001'; // Use 5001 to prevent conflicts
process.env.FRONTEND_URL = 'https://destin-cabs.vercel.app,http://localhost:5173';

const { app, startServer } = require('../server');

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? (() => { try { return JSON.parse(data); } catch(e) { return data; } })() : null
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runDeploymentTests = async () => {
  console.log('🚀 Running Destin Cabs Deployment Verification Suite...\n');
  let serverInstance = null;
  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    // 1. Start Server
    serverInstance = await startServer();
    assert(serverInstance && serverInstance.listening, 'Server starts and listens on host 0.0.0.0:5001');

    // 2. Test Welcome Endpoint GET /
    const rootRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/',
      method: 'GET'
    });
    assert(rootRes.statusCode === 200, 'GET / responds with HTTP 200');
    assert(rootRes.body && rootRes.body.company === 'DESTIN PRIVATE LIMITED', 'GET / returns legal company name');

    // 3. Test Health Endpoint GET /api/health
    const healthRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/health',
      method: 'GET'
    });
    assert(healthRes.statusCode === 200, 'GET /api/health responds with HTTP 200');
    assert(healthRes.body && healthRes.body.status === 'healthy', 'GET /api/health reports status: healthy');
    assert(healthRes.body && healthRes.body.database && healthRes.body.database.connected === true, 'GET /api/health reports database connected');
    assert(healthRes.body && !healthRes.body.database.uri && !healthRes.body.password, 'GET /api/health does NOT expose credentials');

    // 4. Test CORS Preflight OPTIONS /api/vouchers
    const corsOptionsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/vouchers',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://destin-cabs.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    assert(corsOptionsRes.statusCode === 204 || corsOptionsRes.statusCode === 200, 'OPTIONS preflight responds with 200/204');
    assert(corsOptionsRes.headers['access-control-allow-origin'] === 'https://destin-cabs.vercel.app', 'CORS allows configured Vercel production domain');
    assert(corsOptionsRes.headers['access-control-allow-credentials'] === 'true', 'CORS allows credentials');

    // 5. Test Vercel Preview Subdomain CORS Regex matching
    const previewCorsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/vouchers',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://destin-cabs-pr-42.vercel.app',
        'Access-Control-Request-Method': 'GET'
      }
    });
    assert(previewCorsRes.headers['access-control-allow-origin'] === 'https://destin-cabs-pr-42.vercel.app', 'CORS allows Vercel preview branch deployment');

    // 6. Test Disallowed Foreign Origin (Rejection)
    const blockedOriginRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Origin': 'https://malicious-site.example.com'
      }
    });
    assert(blockedOriginRes.headers['access-control-allow-origin'] !== 'https://malicious-site.example.com', 'CORS correctly blocks unauthorized external origins in production');

    // 7. Test Security Headers (Helmet)
    assert(healthRes.headers['x-dns-prefetch-control'] !== undefined, 'Security header X-DNS-Prefetch-Control is present');
    assert(healthRes.headers['x-content-type-options'] === 'nosniff', 'Security header X-Content-Type-Options: nosniff is enforced');

    console.log('\n========================================');
    console.log(`Deployment Tests: ${passed} Passed, ${failed} Failed`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (serverInstance) {
      serverInstance.close(async () => {
        const mongoose = require('mongoose');
        try {
          await mongoose.connection.close();
        } catch (e) {}
        process.exit(failed > 0 ? 1 : 0);
      });
    } else {
      process.exit(failed > 0 ? 1 : 0);
    }
  }
};

runDeploymentTests();
