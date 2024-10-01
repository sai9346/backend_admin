// models/AuditTrail.js
const mongoose = require('mongoose');

const AuditTrailSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  changeType: { type: String, required: true }, // e.g., 'plan_upgrade', 'quota_change'
  dateTime: { type: Date, default: Date.now },
  success: { type: Boolean, required: true },
  otpValidationAttempts: { type: Number, default: 0 }
});

module.exports = mongoose.model('AuditTrail', AuditTrailSchema);
