const mongoose = require('mongoose');
const User = require('../models/User');
const UsageHistory = require('../models/UsageHistory');

// Get All Users/Recruiters
const getAllUsers = async (req, res) => {
    const { plan, createdAt, status } = req.query;

    try {
        let filters = {};
        if (plan) filters.plan = new mongoose.Types.ObjectId(plan); // Correctly instantiate ObjectId
        if (status) filters.accountStatus = status === 'active'; // Convert to boolean
        if (createdAt) filters.createdAt = { $gte: new Date(createdAt) };

        const users = await User.find(filters).populate('plan');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Usage History
const getUserUsageHistory = async (req, res) => {
    try {
        const usageHistory = await UsageHistory.findOne({ user: req.params.id })
            .populate('user')
            .populate('notifications');

        if (!usageHistory) return res.status(404).json({ message: 'Usage history not found' });
        res.status(200).json(usageHistory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('plan')
            .populate('usageHistory')
            .populate('billingHistory');

        if (!user) return res.status(404).json({ message: 'User not found' });

        const remainingQuotas = {
            jobPosts: user.jobPostLimit - user.jobPostsUsed,
            candidateSearches: user.candidateSearchLimit - user.candidateSearchesUsed,
        };

        res.status(200).json({ user, remainingQuotas });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Insert Dummy Data
const insertDummyData = async (req, res) => {
    try {
        const basicPlanId = new mongoose.Types.ObjectId("66fab2decb72b34e0b4d1207"); // Correctly instantiate ObjectId
        const premiumPlanId = new mongoose.Types.ObjectId("66fb85c2c67b889475c70207"); // Correctly instantiate ObjectId

        const users = [
            {
                name: "John Doe",
                email: "john.doe@example.com",
                plan: basicPlanId,
                contactNumber: "1234567890",
                accountStatus: "active",
                createdAt: new Date(),
                jobPostLimit: 10,
                jobPostsUsed: 3,
                candidateSearchLimit: 5,
                candidateSearchesUsed: 2,
            },
            {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                plan: premiumPlanId,
                contactNumber: "0987654321",
                accountStatus: "inactive",
                createdAt: new Date(),
                jobPostLimit: 20,
                jobPostsUsed: 10,
                candidateSearchLimit: 10,
                candidateSearchesUsed: 5,
            },
        ];

        const createdUsers = await User.insertMany(users);

        const usageHistories = [
            {
                user: createdUsers[0]._id,
                notifications: ["Email sent to user"],
                planHistory: [
                    {
                        plan: basicPlanId,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                ],
            },
            {
                user: createdUsers[1]._id,
                notifications: ["SMS sent to user"],
                planHistory: [
                    {
                        plan: premiumPlanId,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                ],
            },
        ];

        await UsageHistory.insertMany(usageHistories);

        res.status(201).json({ message: 'Dummy data inserted successfully', createdUsers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserUsageHistory,
    getUserProfile,
    insertDummyData,
};
