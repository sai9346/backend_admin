const OTP = require('../models/OTP'); // Model for OTP

const validateOTP = async (recipient, otp) => {
  try {
    // Find the OTP document based on the recipient and OTP code
    const otpRecord = await OTP.findOne({ recipient, otp });

    if (!otpRecord) {
      return false; // OTP not found or invalid
    }

    // OTP found, it is valid
    await OTP.deleteOne({ _id: otpRecord._id }); // Remove OTP after successful validation
    return true;
  } catch (err) {
    console.error('Error validating OTP:', err.message);
    return false;
  }
};

// Middleware to validate OTP for specific requests
const otpMiddleware = async (req, res, next) => {
  const { otp } = req.body; // OTP will be sent in the request body
  const recipient = req.admin.email; // Assuming the admin's email is used as recipient

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  const isValid = await validateOTP(recipient, otp);

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // If OTP is valid, proceed to the next middleware or controller
  next();
};

module.exports = otpMiddleware;
