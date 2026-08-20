require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { pool } = require('./src/db');

const app = express();

// ============================================================================
// GLOBAL MIDDLEWARE
// ============================================================================
// Handles JSON parsing, CORS, logging, and shared request processing for all API calls.

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// HEALTH CHECKS
// ============================================================================
// Simple server status checks and database connectivity checks for local debugging.

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check endpoint
app.get('/health/db', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('❌ Database health check failed:', err.message);
      return res.status(503).json({
        status: 'unhealthy',
        database: 'disconnected',
        error: err.message
      });
    }
    conn.release();
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  });
});

// ============================================================================
// API ROUTES
// ============================================================================
// Main application endpoints: income, expenses, and budgets, each mapped to a controller.
app.use('/api/income', require('./src/routes/income'));
app.use('/api/expenses', require('./src/routes/expenses'));
app.use('/api/budgets', require('./src/routes/budgets'));

// ============================================================================
// STATIC FILES & SPA FALLBACK (PRODUCTION)
// ============================================================================

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist/budget-tracker-pro');
  
  // Serve static files
  app.use(express.static(distPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Allow API routes to be handled normally
    if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/health/db') {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 4000;

// Initialize database connection on startup
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.warn('⚠️  Continuing to start server without DB connection. DB queries will fail until DB is available.');
  } else {
    console.log('✅ Database connection pool initialized successfully');
    conn.release();
  }

  // Start server
  app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          🚀 Budget Tracker API Server Running 🚀           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
    console.log('');
    console.log('Available Endpoints:');
    console.log('  GET  /health             - Server health check');
    console.log('  GET  /health/db          - Database health check');
    console.log('  GET  /api/income         - List all income');
    console.log('  POST /api/income         - Create income');
    console.log('  GET  /api/expenses       - List all expenses');
    console.log('  POST /api/expenses       - Create expense');
    console.log('  GET  /api/budgets        - List all budgets');
    console.log('  POST /api/budgets        - Create budget');
    console.log('');
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end((err) => {
    if (err) console.error('Error closing pool:', err);
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  pool.end((err) => {
    if (err) console.error('Error closing pool:', err);
    process.exit(0);
  });
});

module.exports = app;
