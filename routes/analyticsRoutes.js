const express = require('express');
const router = express.Router();
const {
    planUsageReports,
    featureUsageReports,
    planUpgradeDowngradeTrends,
    getAnalyticsData
} = require('../controllers/analyticsController');

// Get plan usage reports
router.get('/plan-usage', async (req, res) => {
    try {
        const data = await planUsageReports();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get feature usage reports
router.get('/feature-usage', async (req, res) => {
    try {
        const data = await featureUsageReports();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get plan upgrade/downgrade trends
router.get('/upgrade-downgrade-trends', async (req, res) => {
    try {
        const data = await planUpgradeDowngradeTrends();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get general analytics data
router.get('/', getAnalyticsData);


module.exports = router;
