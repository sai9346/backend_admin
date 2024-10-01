const mongoose = require('mongoose');

const PlanChangeLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    oldPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }, // Reference to old Plan
    newPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }, // Reference to new Plan
    changeDate: { type: Date, default: Date.now } // Date of the change
});

// Middleware to set the change date before saving
PlanChangeLogSchema.pre('save', function (next) {
    this.changeDate = Date.now();
    next();
});

module.exports = mongoose.model('PlanChangeLog', PlanChangeLogSchema);
