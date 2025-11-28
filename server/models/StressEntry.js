const mongoose = require('mongoose');

const StressEntrySchema = new mongoose.Schema({
  userId: {
    type: String, // For now, we'll just use a generated ID or session ID
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  answers: {
    type: Object, // Store the raw answers
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StressEntry', StressEntrySchema);
