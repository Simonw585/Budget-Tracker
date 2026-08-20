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
    'SELECT id FROM expense_categories WHERE name = ? LIMIT 1',
    [trimmed]
  );

  if (existing) {
    return existing.id;
  }

  const [result] = await poolPromise.query(
    'INSERT INTO expense_categories (name) VALUES (?)',
    [trimmed]
  );

  return result.insertId;
};

const validateExpense = (body) => {
  const errors = [];
  if (!body.category || typeof body.category !== 'string' || body.category.trim() === '') {
    errors.push('Category is required and must be a non-empty string');
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
    errors.push('Description is required and must be a non-empty string');
  }
  const parsedAmount = getNumericAmount(body.amount);
  if (parsedAmount === null || parsedAmount <= 0) {
    errors.push('Amount is required and must be a positive number');
  }
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('Date is required and must be in YYYY-MM-DD format');
  }
  return errors;
};

exports.list = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let query = `
      SELECT e.id, e.category, DATE_FORMAT(e.date, '%Y-%m-%d') AS date, e.category_id, e.description, e.amount, e.payment_method, e.notes, e.is_recurring, e.budget_id, e.user_id, e.created_at, e.updated_at, ec.name AS category_name
      FROM expenses e
      LEFT JOIN expense_categories ec ON ec.id = e.category_id
      WHERE 1=1`;
    const params = [];

    if (startDate) {
      query += ' AND e.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND e.date <= ?';
      params.push(endDate);
    }
    if (category) {
      query += ' AND (e.category = ? OR ec.name = ?)';
      params.push(category, category);
    }

    query += ' ORDER BY e.date DESC, e.created_at DESC';

    const [rows] = await poolPromise.query(query, params);
    res.json(rows || []);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses', details: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }
    const [rows] = await poolPromise.query(
      'SELECT * FROM expenses WHERE id = ?',
      [id]
    );
    const expense = rows[0] || null;
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    console.error('❌ Error fetching expense:', err);
    res.status(500).json({ error: 'Failed to fetch expense', details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { category, description, amount, date, payment_method = null, notes = null, category_id = null, budget_id = null, is_recurring = false } = req.body;
    const parsedAmount = getNumericAmount(amount);
    const normalizedCategory = (category || '').trim();
    const resolvedCategoryId = category_id !== null && category_id !== undefined && category_id !== ''
      ? Number(category_id)
      : await resolveCategoryId(normalizedCategory);

    const [result] = await poolPromise.query(
      'INSERT INTO expenses (category, category_id, description, amount, date, payment_method, notes, budget_id, is_recurring) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [normalizedCategory, resolvedCategoryId, description.trim(), parsedAmount, date, payment_method, notes, budget_id, is_recurring]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Expense created successfully'
    });
  } catch (err) {
    console.error('❌ Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }

    const errors = validateExpense(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { category, description, amount, date, payment_method, notes, category_id = null, budget_id, is_recurring } = req.body;
    const parsedAmount = getNumericAmount(amount);
    const normalizedCategory = (category || '').trim();
    const resolvedCategoryId = category_id !== null && category_id !== undefined && category_id !== ''
      ? Number(category_id)
      : await resolveCategoryId(normalizedCategory);

    const [result] = await poolPromise.query(
      'UPDATE expenses SET category=?, category_id=?, description=?, amount=?, date=?, payment_method=?, notes=?, budget_id=?, is_recurring=? WHERE id=?',
      [normalizedCategory, resolvedCategoryId, description.trim(), parsedAmount, date, payment_method, notes, budget_id, is_recurring !== undefined ? is_recurring : false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ updated: true, message: 'Expense updated successfully' });
  } catch (err) {
    console.error('❌ Error updating expense:', err);
    res.status(500).json({ error: 'Failed to update expense', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }

    const [result] = await poolPromise.query(
      'DELETE FROM expenses WHERE id=?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ deleted: true, message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense', details: err.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const [categories] = await poolPromise.query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
      FROM expenses
      GROUP BY category
      ORDER BY total DESC
    `);
    
    res.json(categories || []);
  } catch (err) {
    console.error('❌ Error fetching expense categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = 'SELECT COUNT(*) as total_expenses, SUM(amount) as total_amount FROM expenses WHERE 1=1';
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
    res.json(results[0] || { total_expenses: 0, total_amount: 0 });
  } catch (err) {
    console.error('❌ Error fetching expense summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
};
