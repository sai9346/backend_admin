// controllers/notificationController.js
const { sendNotification } = require('../services/notificationService');
const Notification = require('../models/Notification');
const Billing = require('../models/Billing');
const User = require('../models/User');

const saveNotification = async (userId, message, type) => {
    const notification = new Notification({ user: userId, message, type });
    await notification.save();
};

// Send a notification to a single user
const sendUserNotification = async (req, res) => {
    const { userId, message, type } = req.body;

    if (!userId || !message || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Send the notification
        await sendNotification(userId, message, type);

        // Save the notification to the database
        await saveNotification(userId, message, type);

        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (err) {
        console.error('Error sending notification:', err);
        res.status(500).json({ message: 'Failed to send notification', error: err.message });
    }
};

// Send bulk notifications to multiple users
const sendBulkNotifications = async (req, res) => {
    const { userIds, message, type } = req.body;

    if (!userIds || !Array.isArray(userIds) || !message || !type) {
        return res.status(400).json({ message: 'Missing required fields or invalid data format' });
    }

    try {
        const notificationPromises = userIds.map(async (userId) => {
            // Send notification for each user
            await sendNotification(userId, message, type);

            // Save each notification to the database
            return saveNotification(userId, message, type);
        });

        // Wait for all notifications to be sent and saved
        await Promise.all(notificationPromises);

        res.status(200).json({ message: 'Bulk notifications sent successfully' });
    } catch (err) {
        console.error('Error sending bulk notifications:', err);
        res.status(500).json({ message: 'Failed to send bulk notifications', error: err.message });
    }
};

// Get notifications log
const getNotificationsLog = async (req, res) => {
    try {
        const notifications = await Notification.find(); // Fetch all notifications
        res.status(200).json(notifications); // Return the notifications
    } catch (err) {
        console.error('Error fetching notifications log:', err);
        res.status(500).json({ message: 'Failed to fetch notifications log', error: err.message });
    }
};

// Function to handle user deactivation
const deactivateUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.isActive = false; // Assuming there's an isActive field
    await user.save();

    const message = 'Your account has been deactivated. Please contact support for further assistance.';
    await sendUserNotification({ userId, message, type: 'email' });
};

// Function to notify users of new features
const sendFeatureUpdateNotification = async (planId, feature) => {
    const billings = await Billing.find({ plan: planId }).populate('user');
    
    for (const billing of billings) {
        const message = `The plan has been updated to include the new feature: ${feature}.`;
        await sendUserNotification({ userId: billing.user._id, message, type: 'email' });
    }
};

module.exports = {
    sendUserNotification,
    sendBulkNotifications,
    getNotificationsLog,
    deactivateUser,
    sendFeatureUpdateNotification
};
