const mongoose = require('mongoose');

// Define the UsageHistory schema
const UsageHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planHistory: [{
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' }
  }],
  featureUsage: {
    jobPosts: { type: Number, default: 0 },
    candidateShortlists: { type: Number, default: 0 },
    videoInterviewsUsed: { type: Number, default: 0 }
  },
  notificationsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  notifications: { type: [String], default: [] },  // Combined notifications from second schema
  billingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Billing' }]
});

module.exports = mongoose.model('UsageHistory', UsageHistorySchema);
