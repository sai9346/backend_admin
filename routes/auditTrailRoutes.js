// routes/auditTrailRoutes.js
const express = require('express');
const router = express.Router();
const { getAuditTrail } = require('../controllers/auditTrailController');

// Route to get all audit records
router.get('/audit', getAuditTrail);

module.exports = router;
