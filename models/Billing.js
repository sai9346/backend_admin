// models/Billing.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    invoiceNumber: { type: String, required: true }, 
    renewalDate: { type: Date, required: true },
    features: [{ type: String }] 
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
