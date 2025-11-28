const express = require('express');
const router = express.Router();
const StressEntry = require('../models/StressEntry');

// Calculate stress score (Mock logic for now)
const calculateScore = (answers) => {
  // Simple summation example. Adjust based on actual questionnaire.
  let score = 0;
  for (const key in answers) {
    score += parseInt(answers[key]) || 0;
  }
  return score;
};

// POST /api/assess
router.post('/assess', async (req, res) => {
  try {
    const { answers, userId } = req.body;
    const score = calculateScore(answers);
    
    // Save to DB (if DB is connected)
    // const entry = new StressEntry({ userId, score, answers });
    // await entry.save();

    // For now, just return the score and solutions
    const solutions = getSolutions(score);
    
    res.json({ score, solutions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper to get solutions
const getSolutions = (score) => {
  if (score < 5) {
    return [
      { title: 'Keep it up!', description: 'Your stress levels are low. Continue your healthy habits.' },
      { title: 'Light Breathing', description: 'Try a 2-minute breathing exercise to stay centered.' }
    ];
  } else if (score < 10) {
    return [
      { title: 'Take a Break', description: 'You seem a bit stressed. Step away from work for 10 minutes.' },
      { title: 'Guided Meditation', description: 'Try this 5-minute meditation for relaxation.' }
    ];
  } else {
    return [
      { title: 'Deep Relaxation', description: 'High stress detected. Consider a long walk or deep sleep.' },
      { title: 'Professional Help', description: 'If you feel overwhelmed, talking to a professional can help.' }
    ];
  }
};

module.exports = router;
