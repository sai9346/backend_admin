const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  contactNumber: { type: String, required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  accountStatus: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (next) {
  if (!this.email) {
    return next(new Error('Email is required'));
  }
  next();
});

UserSchema.post('save', function (user) {
  console.log(`User saved: ${user.name}`);
});

module.exports = mongoose.model('User', UserSchema);
