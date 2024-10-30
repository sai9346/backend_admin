const mongoose = require('mongoose');
const User = require('../models/User');
const Plan = require('../models/Plan');
const FeatureUsage = require('../models/FeatureUsage');
const PlanChangeLog = require('../models/PlanChangeLog');
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
                    from: "plans",
                    let: { planId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$planId" }]
                                }
                            }
                        }
                    ],
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

        // Fetch revenue data by mapping through the planUsage
        const revenueData = await Promise.all(planUsage.map(async (plan) => {
            const planDetails = await Plan.findById(mongoose.Types.ObjectId(plan._id));
            return {
                plan: planDetails ? planDetails.name : "Unknown Plan",
                count: plan.count,
                revenue: planDetails ? plan.count * planDetails.price : 0
            };
        }));

        return revenueData;
    } catch (error) {
        console.error('Error fetching plan usage reports:', error);
        throw error;
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

        return featureUsage;
    } catch (error) {
        console.error('Error fetching feature usage reports:', error);
        throw error;
    }
};

// Plan upgrade/downgrade trends
exports.planUpgradeDowngradeTrends = async () => {
    try {
        const trends = await PlanChangeLog.aggregate([
            { 
                $match: { 
                    changeDate: { $gte: moment().subtract(1, 'month').toDate() } 
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
                    from: "plans",
                    let: { planId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$planId" }]
                                }
                            }
                        }
                    ],
                    as: "planDetails"
                }
            },
            { 
                $project: {
                    plan: { $arrayElemAt: ["$planDetails.name", 0] },
                    count: 1
                }
            }
        ]);

        return trends;
    } catch (error) {
        console.error('Error fetching plan upgrade/downgrade trends:', error);
        throw error;
    }
};

// General analytics data fetch
exports.getAnalyticsData = async (req, res) => {
    try {
        const analyticsData = {
            planUsage: await exports.planUsageReports(),
            featureUsage: await exports.featureUsageReports(),
            planTrends: await exports.planUpgradeDowngradeTrends(),
        };

        res.status(200).json(analyticsData);
    } catch (err) {
        console.error('Error fetching analytics data:', err);
        res.status(500).json({ error: err.message });
    }
};
