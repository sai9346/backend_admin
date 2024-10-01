const mongoose = require('mongoose');

const FeatureUsageSchema = new mongoose.Schema({
    feature: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature', required: true }, // Reference to Feature model
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    usageCount: { type: Number, default: 0 }, // Count of how many times the feature has been used
    timestamp: { type: Date, default: Date.now } // Timestamp of when the feature was used
});

// Middleware to update the timestamp field before saving
FeatureUsageSchema.pre('save', function (next) {
    this.timestamp = Date.now();
    next();
});

module.exports = mongoose.model('FeatureUsage', FeatureUsageSchema);
