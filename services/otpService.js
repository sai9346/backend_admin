const nodemailer = require('nodemailer');
const crypto = require('crypto');
const OTP = require('../models/OTP');
const dotenv = require('dotenv');

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate a random OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Function to send OTP to admin
const sendOtpToAdmin = async (recipient, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error.message || error);
    throw new Error('Error sending OTP');
  }
};

// Function to generate OTP, send it, and save it in the database
const generateAndSendOTP = async (adminEmail, userId, action) => {
  // Only generate and send OTP if the action is initiated by an admin
  const otp = generateOTP();

  // Send OTP to admin
  await sendOtpToAdmin(adminEmail, otp);

  // Save OTP record in the database
  const otpRecord = new OTP({
    recipient: adminEmail,
    otp,
    userId,
    action,
    createdAt: Date.now(),
  });

  await otpRecord.save();
  return otp;
};

// Function to validate OTP
const validateOTP = async (recipient, otp, userId, action) => {
  try {
    // Check if OTP exists and is not expired
    const otpRecord = await OTP.findOne({ recipient, otp, userId, action });
    if (!otpRecord || Date.now() - otpRecord.createdAt > 300000) { // OTP expires in 5 minutes
      return false;
    }

    // OTP is valid, delete it after usage
    await OTP.deleteOne({ _id: otpRecord._id });
    return true;
  } catch (error) {
    console.error('Error validating OTP:', error.message || error);
    return false;
  }
};

module.exports = { generateAndSendOTP, validateOTP };
