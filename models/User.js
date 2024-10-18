// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  contactNumber: { type: String, required: true },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan', // Assuming you have a Plan model
  },
  jobPostLimit: { type: Number, default: 10 },
  jobPostsUsed: { type: Number, default: 0 },
  candidateSearchLimit: { type: Number, default: 20 },
  candidateSearchesUsed: { type: Number, default: 0 },
  bulkMessageLimit: { type: Number, default: 5 },
  bulkMessagesUsed: { type: Number, default: 0 },
  videoInterviewsConducted: { type: Number, default: 0 },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
