const express = require('express');
const router = express.Router();
const expensesCtrl = require('../controllers/expenses');

// Main CRUD endpoints
router.get('/', expensesCtrl.list);
router.post('/', expensesCtrl.create);
router.get('/categories', expensesCtrl.getByCategory);
router.get('/summary', expensesCtrl.getSummary);
router.get('/:id', expensesCtrl.get);
router.put('/:id', expensesCtrl.update);
router.delete('/:id', expensesCtrl.remove);

module.exports = router;
