const mongoose = require('mongoose');

// Define the OTP schema
const OTPSchema = new mongoose.Schema({
  otp: { type: String, required: true },
  recipient: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Store admin ID
  action: { type: String, required: true }, // Action for which OTP is generated
  createdAt: { type: Date, default: Date.now, expires: '5m' } // Valid for 5 minutes
});

// Export the OTP model
module.exports = mongoose.model('OTP', OTPSchema);
