// routes/notificationRoutes.js
const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Notification actions
router.post('/send', notificationController.sendUserNotification);
router.post('/send-bulk', notificationController.sendBulkNotifications);
router.get('/log', notificationController.getNotificationsLog);

module.exports = router;
