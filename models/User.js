const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['Recruiter', 'User'], required: true },
  plan: { type: String, enum: ['Basic', 'Premium', 'VIP'], required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  planExpiration: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  quotas: {
    jobPosts: {
      used: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    bulkMessages: {
      used: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    candidateSearches: {
      used: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    videoInterviews: {
      used: { type: Number, default: 0 },
      total: { type: Number, required: true }
    }
  }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
