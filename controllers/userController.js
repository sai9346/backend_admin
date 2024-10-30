const mongoose = require('mongoose');
const User = require('../models/User');
const Plan = require('../models/Plan');
const UsageHistory = require('../models/UsageHistory');
const { sendNotification } = require('../services/notificationService');

// Update User Quotas
const updateUserQuotas = async (req, res) => {
    const { userId, quotas } = req.body;

    if (!userId || !quotas) {
        return res.status(400).json({ message: 'User ID and quotas are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user quotas
        user.quotas.jobPosts.total = quotas.jobPosts.total || user.quotas.jobPosts.total;
        user.quotas.bulkMessages.total = quotas.bulkMessages.total || user.quotas.bulkMessages.total;
        user.quotas.candidateSearches.total = quotas.candidateSearches.total || user.quotas.candidateSearches.total;
        user.quotas.videoInterviews.total = quotas.videoInterviews.total || user.quotas.videoInterviews.total;

        await user.save();

        res.status(200).json({ message: 'User quotas updated successfully', user });
    } catch (error) {
        console.error('Error updating user quotas:', error);
        res.status(500).json({ message: 'Error updating user quotas', error: error.message });
    }
};

// Function to create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password, type, plan, company, phone, planExpiration, quotas } = req.body;

        const newUser = new User({
            name,
            email,
            password, // Hash the password before saving in a real application
            type,
            plan,
            company,
            phone,
            planExpiration,
            quotas,
        });

        await newUser.save();

        // Create a usage history record for the new user
        const usageHistory = new UsageHistory({ user: newUser._id });
        await usageHistory.save();

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message,
        });
    }
};

// Get all users/recruiters
const getAllUsers = async (req, res) => {
    const { plan, createdAt, status } = req.query;

    try {
        let filters = {};
        if (plan) filters.plan = plan;
        if (status) filters.status = status === 'Active' ? 'Active' : 'Inactive';
        if (createdAt) filters.createdAt = { $gte: new Date(createdAt) };

        const users = await User.find(filters).populate('plan');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get all user profiles (minimal info for listing)
const getAllUserProfiles = async (req, res) => {
    try {
        const users = await User.find().select('name email company phone');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching user profiles:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get individual user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userId)
            .populate('plan')
            .populate('usageHistory')
            .populate('billingHistory');

        if (!user) return res.status(404).json({ message: 'User not found' });

        const remainingQuotas = {
            jobPosts: user.quotas.jobPosts.total - user.quotas.jobPosts.used,
            candidateSearches: user.quotas.candidateSearches.total - user.quotas.candidateSearches.used,
            bulkMessages: user.quotas.bulkMessages.total - user.quotas.bulkMessages.used,
            videoInterviews: user.quotas.videoInterviews.total - user.quotas.videoInterviews.used,
        };

        res.status(200).json({
            user,
            remainingQuotas,
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get user's usage history
const getUserUsageHistory = async (req, res) => {
    try {
        const usageHistory = await UsageHistory.findOne({ user: req.params.id })
            .populate('user')
            .populate('notifications');

        if (!usageHistory) return res.status(404).json({ message: 'Usage history not found' });
        res.status(200).json(usageHistory);
    } catch (err) {
        console.error('Error fetching usage history:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update user plan
const updateUserPlan = async (req, res) => {
    const { id } = req.params;
    const { planId } = req.body;

    if (!planId) {
        return res.status(400).json({ message: 'Plan ID is required' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { plan: planId },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user plan:', error);
        res.status(500).json({ message: 'Error updating user plan', error: error.message });
    }
};

// Assign/Change Plan for a single user
const assignChangePlan = async (req, res) => {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
        return res.status(400).json({ message: 'User ID and Plan ID are required' });
    }

    try {
        const user = await User.findById(userId);
        const plan = await Plan.findById(planId);

        if (!user || !plan) {
            return res.status(404).json({ message: 'User or Plan not found' });
        }

        // Assign new plan
        user.plan = planId;
        await user.save();

        // Send notification
        const message = `Your plan has been assigned/changed to ${plan.name}.`;
        await sendNotification(user.email, message);

        res.status(200).json({ message: 'Plan assigned/changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning/changing plan', error });
    }
};

// Bulk Assign Plans
const bulkAssignPlans = async (req, res) => {
    const { userIds, planId } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !planId) {
        return res.status(400).json({ message: 'User IDs must be an array and Plan ID is required' });
    }

    try {
        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Find all users and assign the plan
        const users = await User.find({ _id: { $in: userIds } });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found for the provided IDs' });
        }

        const notifications = [];

        for (const user of users) {
            user.plan = planId;
            await user.save();

            // Prepare notification message
            notifications.push({
                email: user.email,
                message: `Your plan has been assigned/changed to ${plan.name}.`,
            });
        }

        // Send bulk notifications
        await Promise.all(notifications.map(({ email, message }) => sendNotification(email, message)));

        res.status(200).json({ message: 'Plans assigned successfully to users' });
    } catch (error) {
        res.status(500).json({ message: 'Error bulk assigning plans', error });
    }
};

// Export functions
module.exports = {
    createUser,
    updateUserQuotas,
    getAllUsers,
    getAllUserProfiles,
    getUserProfile,
    getUserUsageHistory,
    updateUserPlan,
    assignChangePlan,
    bulkAssignPlans,
};
