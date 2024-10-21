const express = require('express');
const { generateAndSendOTP, validateOTP } = require('../services/otpService');

const router = express.Router();

// Route to generate and send OTP
router.post('/generate', async (req, res) => {
  const { recipient, userId, action } = req.body;

  try {
    const otp = await generateAndSendOTP(recipient, userId, action);
    res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Route to validate OTP
router.post('/validate', async (req, res) => {
  const { recipient, otp, userId, action } = req.body;

  const isValid = await validateOTP(recipient, otp, userId, action);
  if (isValid) {
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
});

module.exports = router;
