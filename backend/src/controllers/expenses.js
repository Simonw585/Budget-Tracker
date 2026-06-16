const db = require('../db');

exports.list = (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.get = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM expenses WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};

exports.create = (req, res) => {
  const { category, description, amount, date } = req.body;
  db.query('INSERT INTO expenses (category, description, amount, date) VALUES (?, ?, ?, ?)', [category, description, amount, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { category, description, amount, date } = req.body;
  db.query('UPDATE expenses SET category=?, description=?, amount=?, date=? WHERE id=?', [category, description, amount, date, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
};

exports.remove = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM expenses WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
};
