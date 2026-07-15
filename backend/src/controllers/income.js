const { poolPromise } = require('../db');

// Helper function for validation
const validateIncome = (body) => {
  const errors = [];
  if (!body.source || typeof body.source !== 'string' || body.source.trim() === '') {
    errors.push('Source is required and must be a non-empty string');
  }
  if (body.amount === undefined || typeof body.amount !== 'number' || body.amount <= 0) {
    errors.push('Amount is required and must be a positive number');
  }
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('Date is required and must be in YYYY-MM-DD format');
  }
  return errors;
};

exports.list = async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;
    let query = 'SELECT * FROM income WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    if (source) {
      query += ' AND source = ?';
      params.push(source);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const [rows] = await poolPromise.query(query, params);
    res.json(rows || []);
  } catch (err) {
    console.error('❌ Error fetching income:', err);
    res.status(500).json({ error: 'Failed to fetch income', details: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid income ID' });
    }
    const [rows] = await poolPromise.query(
      'SELECT * FROM income WHERE id = ?',
      [id]
    );
    const income = rows[0] || null;
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json(income);
  } catch (err) {
    console.error('❌ Error fetching income:', err);
    res.status(500).json({ error: 'Failed to fetch income', details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validateIncome(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { source, amount, date, description = null, notes = null, is_recurring = false } = req.body;
    
    const [result] = await poolPromise.query(
      'INSERT INTO income (source, amount, date, description, notes, is_recurring) VALUES (?, ?, ?, ?, ?, ?)',
      [source.trim(), amount, date, description, notes, is_recurring]
    );
    
    res.status(201).json({
      id: result.insertId,
      message: 'Income created successfully'
    });
  } catch (err) {
    console.error('❌ Error creating income:', err);
    res.status(500).json({ error: 'Failed to create income', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid income ID' });
    }

    const errors = validateIncome(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { source, amount, date, description, notes, is_recurring } = req.body;
    
    const [result] = await poolPromise.query(
      'UPDATE income SET source=?, amount=?, date=?, description=?, notes=?, is_recurring=? WHERE id=?',
      [source.trim(), amount, date, description, notes, is_recurring !== undefined ? is_recurring : false, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Income not found' });
    }
    
    res.json({ updated: true, message: 'Income updated successfully' });
  } catch (err) {
    console.error('❌ Error updating income:', err);
    res.status(500).json({ error: 'Failed to update income', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid income ID' });
    }

    const [result] = await poolPromise.query(
      'DELETE FROM income WHERE id=?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Income not found' });
    }
    
    res.json({ deleted: true, message: 'Income deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting income:', err);
    res.status(500).json({ error: 'Failed to delete income', details: err.message });
  }
};

exports.getBySource = async (req, res) => {
  try {
    const [sources] = await poolPromise.query(`
      SELECT 
        source,
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
      FROM income
      GROUP BY source
      ORDER BY total DESC
    `);
    
    res.json(sources || []);
  } catch (err) {
    console.error('❌ Error fetching income sources:', err);
    res.status(500).json({ error: 'Failed to fetch sources', details: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = 'SELECT COUNT(*) as total_income_records, SUM(amount) as total_amount FROM income WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    const [results] = await poolPromise.query(query, params);
    res.json(results[0] || { total_income_records: 0, total_amount: 0 });
  } catch (err) {
    console.error('❌ Error fetching income summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
};
