const nodemailer = require('nodemailer');
const twilio = require('twilio');
const crypto = require('crypto');
const OTP = require('../models/OTP'); // Ensure OTP model is defined
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Twilio credentials
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Email setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP and send email/SMS
const generateAndSendOTP = async (recipient, adminId, action) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP

  try {
    // Save OTP in the database with adminId and action
    await OTP.create({ otp, recipient, adminId, action });

    // Send OTP via Email
    await transporter.sendMail({
      to: recipient,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    });

    // Uncomment if SMS is needed
    /*
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient,
    });
    */
  } catch (error) {
    console.error('Error generating or sending OTP:', error);
    throw new Error('Could not send OTP'); // Rethrow to handle in controller
  }
};

// Validate OTP
const validateOTP = async (recipient, otp, adminId, action) => {
  try {
    const otpRecord = await OTP.findOne({ recipient, otp, adminId, action });

    if (!otpRecord) {
      return false; // Invalid OTP
    }

    // OTP is valid, delete it after verification
    await OTP.deleteOne({ _id: otpRecord._id });
    return true; // Valid OTP
  } catch (error) {
    console.error('Error validating OTP:', error);
    return false; // Return false on error
  }
};

module.exports = {
  generateAndSendOTP,
  validateOTP,
};
