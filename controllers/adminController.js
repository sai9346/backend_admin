const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAndSendOTP, validateOTP } = require('../services/otpService');
const User = require('../models/User');
const Plan = require('../models/Plan');

// Register Admin
const registerAdmin = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  
  if (!name || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: 'Please provide name, email, password, and phone number' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword, phoneNumber });
    await admin.save();

    // Generate and send OTP
    await generateAndSendOTP(email, admin._id, 'REGISTER_ADMIN'); // Send OTP to the admin's email

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Admin registered successfully. Please verify your email with the OTP.', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error('Login error: Missing email or password');
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    console.log('Login attempt with email:', email);
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.error('Login error: Admin not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.error('Login error: Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// View All Users/Recruiters and Plans
const viewAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('plan');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Change Plan for User/Recruiter with OTP Validation
const changePlan = async (req, res) => {
  const { email, planId, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  const otpValid = await validateOTP(email, otp, req.admin._id, 'CHANGE_PLAN');
  if (!otpValid) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const user = await User.findOne({ email });
    const plan = await Plan.findById(planId);
    if (!user || !plan) {
      return res.status(404).json({ message: 'User or Plan not found' });
    }

    user.plan = plan._id; // Set plan ID
    await user.save();
    res.status(200).json({ message: 'Plan updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Bulk Assign Plans (for multiple users)
const bulkAssignPlans = async (req, res) => {
  const { emails, planId, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  const otpValid = await validateOTP(req.admin.email, otp, req.admin._id, 'BULK_ASSIGN_PLANS');
  if (!otpValid) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await User.updateMany({ email: { $in: emails } }, { $set: { plan: plan._id } });
    res.status(200).json({ message: 'Plans updated successfully for users' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// View All Plans
const viewAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Modify Plan Details
const modifyPlanDetails = async (req, res) => {
  const { planId } = req.params;
  const { price, features, duration } = req.body;

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (price !== undefined) plan.price = price; // Update price only if provided
    if (features !== undefined) plan.features = features; // Update features only if provided
    if (duration !== undefined) plan.duration = duration; // Update duration only if provided

    await plan.save();
    res.status(200).json({ message: 'Plan details updated successfully', plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Track number of users per plan
const trackPlanUsers = async (req, res) => {
  try {
    const planData = await Plan.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'plan',
          as: 'users'
        }
      },
      {
        $project: {
          name: 1,
          userCount: { $size: '$users' }
        }
      }
    ]);
    res.status(200).json(planData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  viewAllUsers,
  changePlan,
  bulkAssignPlans,
  viewAllPlans,
  modifyPlanDetails,
  trackPlanUsers
};
