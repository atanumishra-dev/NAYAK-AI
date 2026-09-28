const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  location: {
    state: String,
    district: String,
    village: String,
  },
  business_category: String,
  margin_capital: Number,
  project_cost: Number,
  financing_requirement: Number,
  recommended_scheme: String,
  analysis_result: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Advisory', advisorySchema);
