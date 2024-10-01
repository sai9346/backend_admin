const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  renewalDate: { type: Date, required: true }
});

module.exports = mongoose.model('Billing', BillingSchema);
