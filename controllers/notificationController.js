const { sendNotification } = require('../services/notificationService');
const Notification = require('../models/Notification'); // Import the Notification model

// Helper function to save notification
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

module.exports = {
    sendUserNotification,
    sendBulkNotifications,
    getNotificationsLog,
};
