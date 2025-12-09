const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: Object,
    required: true
  },
  stressScore: {
    type: Number,
    required: true
  },
  emotion: {
    type: String,
    enum: ['Anxious', 'Tired', 'Angry', 'Calm', 'Happy'],
    required: true
  },
  aiAnalysis: {
    type: String, // JSON string or text from AI
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
