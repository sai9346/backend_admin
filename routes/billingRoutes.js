const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// Create new billing entry
router.post('/', billingController.createBilling);

// Get all billings
router.get('/', billingController.getAllBillings);

// Get billing by billing ID
router.get('/:id', billingController.getBillingById);

// Update billing by billing ID
router.put('/:id', billingController.updateBilling);

// Delete billing by billing ID
router.delete('/:id', billingController.deleteBilling);

// Extend a user's plan by billing ID
router.put('/:id/extend', billingController.extendPlan);

// Route to seed dummy billing data
router.post('/seed', billingController.seedBillingData);

module.exports = router;












