// controllers/notificationController.js
const { sendNotification } = require('../services/notificationService');
const Notification = require('../models/Notification'); // Import the Notification model

// Send notification to a user
const sendUserNotification = async (req, res) => {
    const { userId, message, type } = req.body; // Adjusted to include userId

    if (!userId || !message || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Send notification
        await sendNotification(userId, message, type);

        // Optionally, save the notification to the database
        const notification = new Notification({ user: userId, message, type });
        await notification.save();

        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send notification', error: err.message });
    }
};

// Send bulk notifications
const sendBulkNotifications = async (req, res) => {
    const { userIds, message, type } = req.body; // Adjusted to include userIds

    if (!userIds || !Array.isArray(userIds) || !message || !type) {
        return res.status(400).json({ message: 'Missing required fields or invalid data format' });
    }

    try {
        for (let userId of userIds) {
            // Send notification
            await sendNotification(userId, message, type);

            // Optionally, save each notification to the database
            const notification = new Notification({ user: userId, message, type });
            await notification.save();
        }
        res.status(200).json({ message: 'Bulk notifications sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send bulk notifications', error: err.message });
    }
};

module.exports = {
    sendUserNotification,
    sendBulkNotifications,
};
