require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/db');

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// routes
app.use('/api/income', require('./src/routes/income'));
app.use('/api/expenses', require('./src/routes/expenses'));
app.use('/api/budgets', require('./src/routes/budgets'));

const PORT = process.env.PORT || 4000;
// Try a DB connection but don't stop the server if DB is unreachable.
db.getConnection((err, conn) => {
  if (err) {
    console.error('Failed to connect to DB', err);
    console.warn('Continuing to start server without DB connection. DB queries will fail until DB is available.');
  } else {
    conn.release();
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
