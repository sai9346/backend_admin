const express = require('express');
const router = express.Router();
const {
    viewUpcomingExpirations,
    renewPlan,
} = require('../controllers/renewalController');

// View upcoming plan expirations
router.get('/upcoming-expirations', viewUpcomingExpirations);

// Renew plan
router.post('/renew', renewPlan);

module.exports = router;
