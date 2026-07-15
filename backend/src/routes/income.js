const express = require('express');
const router = express.Router();
const incomeCtrl = require('../controllers/income');

// Main CRUD endpoints
router.get('/', incomeCtrl.list);
router.post('/', incomeCtrl.create);
router.get('/sources', incomeCtrl.getBySource);
router.get('/summary', incomeCtrl.getSummary);
router.get('/:id', incomeCtrl.get);
router.put('/:id', incomeCtrl.update);
router.delete('/:id', incomeCtrl.remove);

module.exports = router;
