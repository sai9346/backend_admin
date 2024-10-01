const User = require('../models/User');
const { validateOTP, generateAndSendOTP, sendNotification, logChange } = require('../services/otpService');
const moment = require('moment');

// Deactivate user or recruiter account
exports.deactivateAccount = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        // Validate OTP
        const isOtpValid = await validateOTP(userId, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP. Account deactivation failed.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Set user as deactivated and clear plan/feature access
        user.isActive = false;
        user.plan = null; // Assume user has a 'plan' field to store subscription info
        user.features = []; // Assume 'features' field stores active feature list
        await user.save();

        // Real-time deactivation (In case of socket.io or real-time system, you'd emit an event)
        // Example: emit user deactivation event
        // io.emit('account-deactivated', { userId: user._id });

        // Send deactivation notification (to both user or recruiter based on role)
        await sendNotification(user.email, 'Account Deactivation', 'Your account has been deactivated.');

        // Log the change for admin actions
        await logChange(req.adminId, 'Account Deactivation', true);

        res.status(200).json({ message: 'Account deactivated successfully and user has lost access to features/plans.' });
    } catch (error) {
        console.error('Failed to deactivate account:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Reactivate user or recruiter account
exports.reactivateAccount = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        // Validate OTP
        const isOtpValid = await validateOTP(userId, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP. Account reactivation failed.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Restore plan and features if they existed before deactivation
        const previousPlan = user.previousPlan || 'Basic'; // Retrieve the previous plan or default
        const previousFeatures = user.previousFeatures || []; // Retrieve previous features or default

        // Reactivate account and restore previous settings
        user.isActive = true;
        user.plan = previousPlan; // Restore the plan to its previous value
        user.features = previousFeatures; // Restore the features to previous settings
        await user.save();

        // Real-time reactivation (Emit event for real-time systems)
        // Example: emit user reactivation event
        // io.emit('account-reactivated', { userId: user._id });

        // Send reactivation notification (to both user or recruiter based on role)
        await sendNotification(user.email, 'Account Reactivation', 'Your account has been reactivated and previous settings restored.');

        // Log the change for admin actions
        await logChange(req.adminId, 'Account Reactivation', true);

        res.status(200).json({ message: 'Account reactivated successfully with previous plan/feature settings restored.' });
    } catch (error) {
        console.error('Failed to reactivate account:', error.message);
        res.status(500).json({ error: error.message });
    }
};
