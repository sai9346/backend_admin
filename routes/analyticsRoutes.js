const express = require('express');
const router = express.Router();
const {
    planUsageReports,
    featureUsageReports,
    planUpgradeDowngradeTrends,
} = require('../controllers/analyticsController');

// Get plan usage reports
router.get('/plan-usage', planUsageReports);

// Get feature usage reports
router.get('/feature-usage', featureUsageReports);

// Get plan upgrade/downgrade trends
router.get('/upgrade-downgrade-trends', planUpgradeDowngradeTrends);

module.exports = router;
