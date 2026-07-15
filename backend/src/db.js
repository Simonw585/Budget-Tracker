const mysql = require('mysql2');

// Create connection pool with callback-based API
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'budget_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Get promise pool for async/await support
const poolPromise = pool.promise();

// Test connection on startup
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Database connection pool initialized successfully');
    conn.release();
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

module.exports = {
  pool,
  poolPromise,
  // Helper function for executing queries with promises
  query: (sql, values) => poolPromise.query(sql, values)
};
