const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Basic', 'Premium', 'VIP'], // Only allow these values for plan name
        required: true
    },
    description: {
        type: String,
        required: true // Make sure description is required
    },
    price: {
        type: Number,
        required: true // Price should be a required number
    },
    features: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feature' // Ensure features are ObjectIds referencing the 'Feature' model
    }],
    activeUsers: {
        type: Number,
        default: 0 // Track number of active users on this plan
    },
    createdAt: {
        type: Date,
        default: Date.now // Auto-set creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Auto-update the updated date
    }
});

// Pre-save middleware to update the `updatedAt` field on every save
PlanSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Post-save hook for logging
PlanSchema.post('save', function (plan) {
    console.log(`Plan saved: ${plan.name}`);
});

module.exports = mongoose.model('Plan', PlanSchema);
