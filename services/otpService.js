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
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error.message || error);
    throw new Error('Error sending OTP');
  }
};

// Function to generate OTP, send it, and save it in the database
const generateAndSendOTP = async (adminEmail, userId, action) => {
  const otp = generateOTP();
  await sendOtpToAdmin(adminEmail, otp);

  const otpRecord = new OTP({
    recipient: adminEmail,
    otp,
    userId,
    action,
  });

  await otpRecord.save();
  return otp;
};

// Function to validate OTP
const validateOTP = async (recipient, otp, userId, action) => {
  try {
    const otpRecord = await OTP.findOne({ recipient, otp, userId, action });
    if (!otpRecord) return false;

    await OTP.deleteOne({ _id: otpRecord._id }); // Delete OTP after usage
    return true;
  } catch (error) {
    console.error('Error validating OTP:', error.message || error);
    return false;
  }
};

module.exports = { generateAndSendOTP, validateOTP };
