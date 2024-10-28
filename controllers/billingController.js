const Billing = require('../models/Billing');
const User = require('../models/User');
const { sendEmail } = require('../services/notificationService');
const { validateOTP } = require('../services/otpService');

// Extend a user's plan manually
exports.extendPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRenewalDate, otp } = req.body;

    // Validate OTP
    const isValid = await validateOTP(req.user.id, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update the billing record with the new renewal date
    const billing = await Billing.findByIdAndUpdate(id, { renewalDate: new Date(newRenewalDate) }, { new: true });
    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    // Find the associated user
    const user = await User.findById(billing.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send an email notification
    const subject = 'Your plan has been extended!';
    const text = `Dear ${user.name}, your plan has been extended until ${new Date(newRenewalDate).toLocaleDateString()}.`;
    await sendEmail(user.email, subject, text);

    return res.status(200).json({ message: 'Plan extended and notification sent', billing });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to extend plan', details: error.message });
  }
};

// Create a new billing record
exports.createBilling = async (req, res) => {
  try {
    const { userId, amount, invoiceNumber, renewalDate } = req.body;

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new billing record
    const billing = new Billing({
      user: userId,
      amount,
      invoiceNumber,
      renewalDate: new Date(renewalDate), // Ensure it's a Date object
    });

    // Save the billing record
    await billing.save();
    return res.status(201).json({ message: 'Billing record created successfully', billing });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create billing record', details: error.message });
  }
};

// Get all billing records
exports.getAllBillings = async (req, res) => {
  try {
    const billings = await Billing.find().populate('user', 'name email');
    return res.status(200).json(billings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch billing records', details: error.message });
  }
};

// Get a billing record by ID
exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id).populate('user', 'name email');
    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }
    return res.status(200).json(billing);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch billing record', details: error.message });
  }
};

// Update a billing record
exports.updateBilling = async (req, res) => {
  try {
    const { amount, invoiceNumber, renewalDate } = req.body;
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      { amount, invoiceNumber, renewalDate: new Date(renewalDate) }, // Ensure renewalDate is a Date object
      { new: true }
    );

    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }

    return res.status(200).json({ message: 'Billing record updated successfully', billing });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update billing record', details: error.message });
  }
};

// Delete a billing record
exports.deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) {
      return res.status(404).json({ error: 'Billing record not found' });
    }
    return res.status(200).json({ message: 'Billing record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete billing record', details: error.message });
  }
};

// Seed billing data with specific _id, plan, price, and expireDate values
// Seed billing data with specific _id, plan, price, and expireDate values
exports.seedBillingData = async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Define user IDs locally
    const userIds = {
      user1: '671b633183c2f7474bac575c',
      user2: '671b633183c2f7474bac575d',
      user3: '671b6d2a6a74a7fe0d65457b',
      user4: '671b6da76a74a7fe0d65457f',
      user5: '671b6e626a74a7fe0d654583',
      user6: '671b6e826a74a7fe0d654587',
      user7: '671b71c8b25f5d2c81fd886b',
      user8: '671b74b6b25f5d2c81fd887b',
      user9: '671b81d7b25f5d2c81fd888a',
      user10: '671b81f8b25f5d2c81fd888e',
      user11: '671b8265b25f5d2c81fd8894',
      user12: '671b82b2b25f5d2c81fd88a2',
      user13: '671b82fcb25f5d2c81fd88aa',
    };

    const billingData = [
      { user: userIds.user1, invoiceNumber: 'INV001', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user2, invoiceNumber: 'INV002', amount: 100, renewalDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
      { user: userIds.user3, invoiceNumber: 'INV003', amount: 100, renewalDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
      { user: userIds.user4, invoiceNumber: 'INV004', amount: 200, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user5, invoiceNumber: 'INV005', amount: 100, renewalDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
      { user: userIds.user6, invoiceNumber: 'INV006', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user7, invoiceNumber: 'INV007', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user8, invoiceNumber: 'INV008', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user9, invoiceNumber: 'INV009', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user10, invoiceNumber: 'INV010', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user11, invoiceNumber: 'INV011', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user12, invoiceNumber: 'INV012', amount: 150, renewalDate: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) }, // 60 days
      { user: userIds.user13, invoiceNumber: 'INV013', amount: 100, renewalDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
    ];

    // Remove existing records
    await Billing.deleteMany({});

    // Insert new billing data
    await Billing.insertMany(billingData);
    return res.status(201).json({ message: 'Billing data seeded successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to seed billing data', details: error.message });
  }
};

