// controllers/auditTrailController.js
const AuditTrail = require('../models/AuditTrail');

// Get all audit trail records
const getAuditTrail = async (req, res) => {
  try {
    const auditRecords = await AuditTrail.find(); // Fetch all audit records from the DB
    res.status(200).json(auditRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit trail records' });
  }
};

// Create a new audit trail record
const createAuditTrail = async (adminId, changeType, success, otpValidationAttempts) => {
  try {
    const newAuditRecord = new AuditTrail({
      adminId,
      changeType,
      success,
      otpValidationAttempts
    });
    await newAuditRecord.save();
    console.log('Audit trail record added');
  } catch (error) {
    console.error('Error saving audit trail:', error);
  }
};

module.exports = { getAuditTrail, createAuditTrail };
