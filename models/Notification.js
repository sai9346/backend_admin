// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    type: { type: String, enum: ['email', 'sms'], required: true },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
