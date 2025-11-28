const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');

// Mock AI Analysis Function
const mockAIAnalysis = (answers) => {
  const stressLevel = answers.stress || 5;
  let recommendations = [];
  
  if (stressLevel > 7) {
    recommendations = [
      { title: "Deep Breathing", type: "exercise", content: "Try the 4-7-8 breathing technique." },
      { title: "Seek Support", type: "action", content: "Consider talking to a friend or professional." }
    ];
  } else {
    recommendations = [
      { title: "Mindful Walk", type: "exercise", content: "Take a 10-minute walk without your phone." },
      { title: "Gratitude Journal", type: "action", content: "Write down 3 things you are grateful for." }
    ];
  }
  
  return {
    summary: `Based on your stress level of ${stressLevel}, we recommend focusing on immediate relaxation.`,
    recommendations
  };
};

// @route   POST api/assessment
// @desc    Submit assessment & get analysis
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Calculate Score (Simple logic)
    const stressScore = parseInt(answers.stress) || 5; // Simplified

    // AI Analysis
    const analysis = mockAIAnalysis(answers);

    const assessment = new Assessment({
      userId: req.user,
      answers,
      stressScore,
      aiAnalysis: JSON.stringify(analysis)
    });

    await assessment.save();

    res.json({ stressScore, analysis });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/assessment/history
// @desc    Get user's assessment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user }).sort({ timestamp: -1 });
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
