const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    quota: { type: Number, required: true },
});

// Middleware to check for name before saving
FeatureSchema.pre('save', function (next) {
    if (!this.name) {
        return next(new Error('Name is required'));
    }
    next();
});

// Post-save hook for logging
FeatureSchema.post('save', function (feature) {
    console.log(`Feature saved: ${feature.name}`);
});

module.exports = mongoose.model('Feature', FeatureSchema);
