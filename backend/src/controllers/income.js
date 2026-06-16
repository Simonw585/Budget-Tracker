const db = require('../db');

exports.list = (req, res) => {
  db.query('SELECT * FROM income ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.get = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM income WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || null);
  });
};

exports.create = (req, res) => {
  const { source, amount, date } = req.body;
  db.query('INSERT INTO income (source, amount, date) VALUES (?, ?, ?)', [source, amount, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { source, amount, date } = req.body;
  db.query('UPDATE income SET source=?, amount=?, date=? WHERE id=?', [source, amount, date, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
};

exports.remove = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM income WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
};
