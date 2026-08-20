const { poolPromise } = require('../db');

const getNumericAmount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const resolveCategoryId = async (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return null;
  }

  const trimmed = categoryName.trim();
  if (!trimmed) {
    return null;
  }

  const [[existing]] = await poolPromise.query(
    'SELECT id FROM income_categories WHERE name = ? LIMIT 1',
    [trimmed]
  );

  if (existing) {
    return existing.id;
  }

  const [result] = await poolPromise.query(
    'INSERT INTO income_categories (name) VALUES (?)',
    [trimmed]
  );

  return result.insertId;
};

const validateIncome = (body) => {
  const errors = [];
  if (!body.source || typeof body.source !== 'string' || body.source.trim() === '') {
    errors.push('Source is required and must be a non-empty string');
  }
  const parsedAmount = getNumericAmount(body.amount);
  if (parsedAmount === null || parsedAmount <= 0) {
    errors.push('Amount is required and must be a positive number');
  }
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('Date is required and must be in YYYY-MM-DD format');
  }
  if (!body.category && body.category_id === undefined) {
    errors.push('Category is required');
  }
  return errors;
};

exports.list = async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;
    let query = `
      SELECT i.id, i.source, DATE_FORMAT(i.date, '%Y-%m-%d') AS date, i.category_id, i.amount, i.description, i.notes, i.is_recurring, i.user_id, i.created_at, i.updated_at, ic.name AS category_name
      FROM income i
      LEFT JOIN income_categories ic ON ic.id = i.category_id
      WHERE 1=1`;
    const params = [];

    if (startDate) {
      query += ' AND i.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND i.date <= ?';
      params.push(endDate);
    }
    if (source) {
      query += ' AND i.source = ?';
      params.push(source);
    }

    query += ' ORDER BY i.date DESC, i.created_at DESC';

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

    const { source, amount, date, description = null, notes = null, category = null, category_id = null, is_recurring = false } = req.body;
    const parsedAmount = getNumericAmount(amount);
    const resolvedCategoryId = category_id !== null && category_id !== undefined && category_id !== ''
      ? Number(category_id)
      : await resolveCategoryId(category);

    const [result] = await poolPromise.query(
      'INSERT INTO income (source, category_id, amount, date, description, notes, is_recurring) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [source.trim(), resolvedCategoryId, parsedAmount, date, description, notes, is_recurring]
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

    const { source, amount, date, description, notes, category = null, category_id = null, is_recurring } = req.body;
    const parsedAmount = getNumericAmount(amount);
    const resolvedCategoryId = category_id !== null && category_id !== undefined && category_id !== ''
      ? Number(category_id)
      : await resolveCategoryId(category);

    const [result] = await poolPromise.query(
      'UPDATE income SET source=?, category_id=?, amount=?, date=?, description=?, notes=?, is_recurring=? WHERE id=?',
      [source.trim(), resolvedCategoryId, parsedAmount, date, description, notes, is_recurring !== undefined ? is_recurring : false, id]
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
