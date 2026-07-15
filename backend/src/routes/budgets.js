const express = require('express');
const router = express.Router();
const budgetsCtrl = require('../controllers/budgets');

// Main CRUD endpoints
router.get('/', budgetsCtrl.list);
router.post('/', budgetsCtrl.create);
router.get('/categories', budgetsCtrl.getCategories);
router.get('/summary', budgetsCtrl.getSummary);
router.get('/:id', budgetsCtrl.get);
router.put('/:id', budgetsCtrl.update);
router.delete('/:id', budgetsCtrl.remove);

module.exports = router;
