// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otpCode: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, enum: ['deactivate', 'reactivate', 'planChange'], required: true },
  expirationTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'validated', 'expired'], default: 'pending' }
});

module.exports = mongoose.model("Otp", otpSchema);
