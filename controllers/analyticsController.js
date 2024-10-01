const User = require('../models/User');
const Plan = require('../models/Plan');
const FeatureUsage = require('../models/FeatureUsage'); // Assuming you have a model for feature usage
const PlanChangeLog = require('../models/PlanChangeLog'); // Assuming you have a model for tracking plan changes
const moment = require('moment');


// Plan usage reports
exports.planUsageReports = async (req, res) => {
    try {
        const planUsage = await User.aggregate([
            { $group: { _id: "$plan", count: { $sum: 1 } } },
            { $lookup: {
                from: "plans", // Assuming the plans are stored in a collection named 'plans'
                localField: "_id",
                foreignField: "_id",
                as: "planDetails"
            }},
            { $project: {
                plan: { 
                    $cond: { 
                        if: { $gt: [{ $size: "$planDetails" }, 0] }, // Check if planDetails array is not empty
                        then: { $arrayElemAt: ["$planDetails.name", 0] },
                        else: "Unknown Plan" // Default name if no planDetails are found
                    }
                },
                count: 1
            }}
        ]);

        // Calculate revenue from each plan (assumes you have a price field in the Plan model)
        const revenueData = await Promise.all(planUsage.map(async (plan) => {
            const planDetails = await Plan.findById(plan._id);
            return {
                plan: planDetails ? planDetails.name : "Unknown Plan", // Handle if planDetails is null
                count: plan.count,
                revenue: planDetails ? plan.count * planDetails.price : 0 // Handle if price is not found
            };
        }));

        res.status(200).json(revenueData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Feature usage reports
exports.featureUsageReports = async (req, res) => {
    try {
        const featureUsage = await FeatureUsage.aggregate([
            { $group: { _id: "$feature", count: { $sum: 1 } } }
        ]);

        res.status(200).json(featureUsage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Plan upgrade/downgrade trends
exports.planUpgradeDowngradeTrends = async (req, res) => {
    try {
        const trends = await PlanChangeLog.aggregate([
            { $match: { changeDate: { $gte: new Date(moment().subtract(1, 'month')) } } }, // Filter for the last month
            { $group: { _id: "$newPlan", count: { $sum: 1 } } },
            { $lookup: {
                from: "plans", // Assuming the plans are stored in a collection named 'plans'
                localField: "_id",
                foreignField: "_id",
                as: "planDetails"
            }},
            { $project: {
                plan: { $arrayElemAt: ["$planDetails.name", 0] },
                count: 1
            }}
        ]);

        res.status(200).json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
