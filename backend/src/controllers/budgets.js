const db = require('../db');

exports.list = (req, res) => {
  db.query('SELECT * FROM budgets', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.get = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM budgets WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};

exports.create = (req, res) => {
  const { name, amount } = req.body;
  db.query('INSERT INTO budgets (name, amount) VALUES (?, ?)', [name, amount], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { name, amount } = req.body;
  db.query('UPDATE budgets SET name=?, amount=? WHERE id=?', [name, amount, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
};

exports.remove = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM budgets WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
};
