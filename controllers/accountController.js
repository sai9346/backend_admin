const User = require('../models/User');
const { generateOTP, sendOtpToAdmin, sendNotification, validateOTP } = require('../services/otpService');

exports.deactivateAccount = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isAdmin = req.adminId; // Assuming you check if the admin is making the request

        if (!otp) {
            const generatedOtp = generateOTP();
            const adminEmail = req.adminEmail; // Admin's email from request/session

            await sendOtpToAdmin(adminEmail, generatedOtp);
            req.session.otp = generatedOtp;

            return res.status(200).json({ message: 'OTP sent to admin. Please verify OTP to proceed.' });
        }

        if (otp !== req.session.otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        user.isActive = false;
        user.plan = null; // Clear current plan
        user.features = []; // Clear feature list
        await user.save();

        req.io.emit('account-deactivated', { userId: user._id });
        req.session.otp = null;

        await sendNotification(user.email, 'Account Deactivation', 'Your account has been deactivated.');
        res.status(200).json({ message: 'Account deactivated successfully.' });
    } catch (error) {
        console.error('Failed to deactivate account:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.reactivateAccount = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const isOtpValid = await validateOTP(userId, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP. Account reactivation failed.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isActive = true;
        user.plan = user.previousPlan || 'Basic'; // Restore or set to default
        user.features = user.previousFeatures || [];
        await user.save();

        req.io.emit('account-reactivated', { userId: user._id });
        await sendNotification(user.email, 'Account Reactivation', 'Your account has been reactivated.');

        res.status(200).json({ message: 'Account reactivated successfully with previous plan/feature settings restored.' });
    } catch (error) {
        console.error('Failed to reactivate account:', error.message);
        res.status(500).json({ error: error.message });
    }
};
