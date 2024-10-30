const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true }, // e.g., 'plan_upgrade', 'quota_change'
  dateTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], required: true },
  otpValidationAttempts: { type: Number, default: 0 },
});

module.exports = mongoose.model("AuditTrail", auditTrailSchema);
