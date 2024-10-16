// routes/otpRoutes.js
const express = require('express');
const { generateAndSendOTP, validateOTP } = require('../services/otpService');

const router = express.Router();

// Route to send OTP
router.post('/send-otp', async (req, res) => {
  const { recipient, adminId, action } = req.body;

  try {
    await generateAndSendOTP(recipient, adminId, action);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Route to validate OTP
router.post('/validate-otp', async (req, res) => {
  const { recipient, otp, adminId, action } = req.body;

  const isValid = await validateOTP(recipient, otp, adminId, action);
  if (isValid) {
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
});

module.exports = router;
