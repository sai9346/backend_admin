// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reportType: { type: String, required: true }, // e.g., 'usage', 'billing'
  generatedAt: { type: Date, default: Date.now },
  data: { type: Object, required: true }
});

module.exports = mongoose.model('Report', ReportSchema);
