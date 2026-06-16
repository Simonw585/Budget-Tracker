const express = require('express');
const router = express.Router();
const expensesCtrl = require('../controllers/expenses');

router.get('/', expensesCtrl.list);
router.post('/', expensesCtrl.create);
router.get('/:id', expensesCtrl.get);
router.put('/:id', expensesCtrl.update);
router.delete('/:id', expensesCtrl.remove);

module.exports = router;
