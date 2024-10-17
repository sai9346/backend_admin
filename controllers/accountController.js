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

        // Store previous plan/features for reactivation
        user.previousPlan = user.plan; // Save current plan
        user.previousFeatures = user.features; // Save current features

        // Deactivate account
        user.isActive = false;
        user.plan = null; // Clear current plan
        user.features = []; // Clear feature list
        await user.save();

        // Emit real-time event (assumed socket.io)
        req.io.emit('account-deactivated', { userId: user._id });

        // Send notification
        await sendNotification(user.email, 'Account Deactivation', 'Your account has been deactivated.');

        // Log admin action
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

        // Reactivate account and restore previous settings
        user.isActive = true;
        user.plan = user.previousPlan || 'Basic'; // Restore or set to default
        user.features = user.previousFeatures || []; // Restore features
        await user.save();

        // Emit real-time event (assumed socket.io)
        req.io.emit('account-reactivated', { userId: user._id });

        // Send notification
        await sendNotification(user.email, 'Account Reactivation', 'Your account has been reactivated and previous settings restored.');

        // Log admin action
        await logChange(req.adminId, 'Account Reactivation', true);

        res.status(200).json({ message: 'Account reactivated successfully with previous plan/feature settings restored.' });
    } catch (error) {
        console.error('Failed to reactivate account:', error.message);
        res.status(500).json({ error: error.message });
    }
};
