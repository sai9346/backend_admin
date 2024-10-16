// controllers/billingController.js
const Billing = require('../models/Billing');
const User = require('../models/User');

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
      renewalDate,
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
      { amount, invoiceNumber, renewalDate },
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
