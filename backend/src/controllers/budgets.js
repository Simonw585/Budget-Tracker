const { poolPromise } = require('../db');

// Helper function for validation
const validateBudget = (body) => {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('Budget name is required and must be a non-empty string');
  }
  if (body.amount !== undefined && (typeof body.amount !== 'number' || body.amount < 0)) {
    errors.push('Amount must be a non-negative number');
  }
  return errors;
};

exports.list = async (req, res) => {
  try {
    const [rows] = await poolPromise.query(
      'SELECT * FROM budgets WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json(rows || []);
  } catch (err) {
    console.error('❌ Error fetching budgets:', err);
    res.status(500).json({ error: 'Failed to fetch budgets', details: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid budget ID' });
    }
    const [rows] = await poolPromise.query(
      'SELECT * FROM budgets WHERE id = ?',
      [id]
    );
    const budget = rows[0] || null;
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    console.error('❌ Error fetching budget:', err);
    res.status(500).json({ error: 'Failed to fetch budget', details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validateBudget(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { name, amount = 0, category_id = null, period = 'monthly', start_date = null, end_date = null } = req.body;
    
    const [result] = await poolPromise.query(
      'INSERT INTO budgets (name, amount, category_id, period, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), amount, category_id, period, start_date, end_date]
    );
    
    res.status(201).json({
      id: result.insertId,
      message: 'Budget created successfully'
    });
  } catch (err) {
    console.error('❌ Error creating budget:', err);
    res.status(500).json({ error: 'Failed to create budget', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid budget ID' });
    }

    const errors = validateBudget(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { name, amount, category_id, period, start_date, end_date, is_active } = req.body;
    
    const [result] = await poolPromise.query(
      'UPDATE budgets SET name=?, amount=?, category_id=?, period=?, start_date=?, end_date=?, is_active=? WHERE id=?',
      [name.trim(), amount, category_id, period, start_date, end_date, is_active !== undefined ? is_active : true, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({ updated: true, message: 'Budget updated successfully' });
  } catch (err) {
    console.error('❌ Error updating budget:', err);
    res.status(500).json({ error: 'Failed to update budget', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid budget ID' });
    }

    // Soft delete - mark as inactive
    const [result] = await poolPromise.query(
      'UPDATE budgets SET is_active = FALSE WHERE id=?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({ deleted: true, message: 'Budget deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting budget:', err);
    res.status(500).json({ error: 'Failed to delete budget', details: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [categories] = await poolPromise.query(
      'SELECT * FROM budget_categories ORDER BY name ASC'
    );
    res.json(categories || []);
  } catch (err) {
    console.error('❌ Error fetching budget categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const [budgets] = await poolPromise.query(`
      SELECT 
        COUNT(*) as total_budgets,
        SUM(amount) as total_budget_amount,
        SUM(current_spending) as total_spending,
        SUM(amount - current_spending) as remaining_budget
      FROM budgets
      WHERE is_active = TRUE
    `);
    
    res.json(budgets[0] || {});
  } catch (err) {
    console.error('❌ Error fetching budget summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
};
