const User = require('../models/User');
const Plan = require('../models/Plan');
const FeatureUsage = require('../models/FeatureUsage'); // Assuming you have a model for feature usage
const PlanChangeLog = require('../models/PlanChangeLog'); // Assuming you have a model for tracking plan changes
const moment = require('moment');

// Plan usage reports
exports.planUsageReports = async () => {
    try {
        const planUsage = await User.aggregate([
            { 
                $group: { 
                    _id: "$plan", 
                    count: { $sum: 1 } 
                } 
            },
            { 
                $lookup: {
                    from: "plans", // Assuming the plans are stored in a collection named 'plans'
                    localField: "_id",
                    foreignField: "_id",
                    as: "planDetails"
                }
            },
            { 
                $project: {
                    plan: { 
                        $cond: { 
                            if: { $gt: [{ $size: "$planDetails" }, 0] },
                            then: { $arrayElemAt: ["$planDetails.name", 0] },
                            else: "Unknown Plan"
                        }
                    },
                    count: 1
                }
            }
        ]);

        // Calculate revenue from each plan
        const revenueData = await Promise.all(planUsage.map(async (plan) => {
            const planDetails = await Plan.findById(plan._id);
            return {
                plan: planDetails ? planDetails.name : "Unknown Plan",
                count: plan.count,
                revenue: planDetails ? plan.count * planDetails.price : 0
            };
        }));

        return revenueData; // Return data instead of sending response here
    } catch (error) {
        console.error('Error fetching plan usage reports:', error);
        throw error; // Throw error to be caught in the calling function
    }
};

// Feature usage reports
exports.featureUsageReports = async () => {
    try {
        const featureUsage = await FeatureUsage.aggregate([
            { 
                $group: { 
                    _id: "$feature", 
                    count: { $sum: 1 } 
                } 
            }
        ]);

        return featureUsage; // Return data instead of sending response here
    } catch (error) {
        console.error('Error fetching feature usage reports:', error);
        throw error; // Throw error to be caught in the calling function
    }
};

// Plan upgrade/downgrade trends
exports.planUpgradeDowngradeTrends = async () => {
    try {
        const trends = await PlanChangeLog.aggregate([
            { 
                $match: { 
                    changeDate: { $gte: moment().subtract(1, 'month').toDate() } // Ensure date is in Date format
                } 
            },
            { 
                $group: { 
                    _id: "$newPlan", 
                    count: { $sum: 1 } 
                } 
            },
            { 
                $lookup: {
                    from: "plans", // Assuming the plans are stored in a collection named 'plans'
                    localField: "_id",
                    foreignField: "_id",
                    as: "planDetails"
                }
            },
            { 
                $project: {
                    plan: { $arrayElemAt: ["$planDetails.name", 0] }, // Safely retrieve plan name
                    count: 1
                }
            }
        ]);

        return trends; // Return data instead of sending response here
    } catch (error) {
        console.error('Error fetching plan upgrade/downgrade trends:', error);
        throw error; // Throw error to be caught in the calling function
    }
};

// General analytics data fetch
exports.getAnalyticsData = async (req, res) => {
    try {
        const analyticsData = {
            planUsage: await exports.planUsageReports(), // Call the specific report functions
            featureUsage: await exports.featureUsageReports(),
            planTrends: await exports.planUpgradeDowngradeTrends(),
        };

        res.status(200).json(analyticsData);
    } catch (err) {
        console.error('Error fetching analytics data:', err);
        res.status(500).json({ error: err.message });
    }
};
