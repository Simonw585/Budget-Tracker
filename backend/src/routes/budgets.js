const express = require('express');
const router = express.Router();
const budgetsCtrl = require('../controllers/budgets');

router.get('/', budgetsCtrl.list);
router.post('/', budgetsCtrl.create);
router.get('/:id', budgetsCtrl.get);
router.put('/:id', budgetsCtrl.update);
router.delete('/:id', budgetsCtrl.remove);

module.exports = router;
