// routes/planChangeLogRoutes.js
const express = require('express');
const PlanChangeLog = require('../models/PlanChangeLog');
const router = express.Router();

// Endpoint to fetch plan change trends
router.get('/trends', async (req, res) => {
    const { startDate, endDate } = req.query; // Get dates from query parameters
    try {
        const results = await PlanChangeLog.aggregate([
            {
                $match: {
                    changeDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: { $cond: [{ $eq: ['$newPlan', '$oldPlan'] }, 'No Change', 'Change'] },
                    count: { $sum: 1 }
                }
            }
        ]);
        const trends = {
            upgrades: results.find(r => r._id === 'Change')?.count || 0,
            downgrades: results.find(r => r._id === 'No Change')?.count || 0,
        };
        res.json(trends);
    } catch (error) {
        console.error('Error fetching plan trends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
