const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// Billing routes
router.post('/create', billingController.createBilling);
router.get('/', billingController.getAllBillings);
router.get('/:id', billingController.getBillingById);
router.put('/:id', billingController.updateBilling);
router.delete('/:id', billingController.deleteBilling);

module.exports = router;
