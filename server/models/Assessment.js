const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  level: {
    type: String, // 'Low', 'Moderate', 'High'
    required: true
  },
  answers: {
    type: [Number], // Array of scores per question
    required: true
  },
  mood: {
    type: String,
    default: 'Neutral'
  },
  symptoms: {
    type: [String],
    default: []
  },
  triggers: {
    type: [String],
    default: []
  },
  intensity: {
    type: Number,
    default: 5
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
