const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect routes with authMiddleware
router.use(authMiddleware);

// Notification actions
router.post('/send', notificationController.sendUserNotification);
router.post('/send-bulk', notificationController.sendBulkNotifications);

module.exports = router;
