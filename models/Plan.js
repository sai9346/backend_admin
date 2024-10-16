const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Basic', 'Premium', 'VIP'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    features: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feature'
    }],
    activeUsers: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
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
