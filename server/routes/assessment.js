const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock in-memory assessments for testing
let assessments = [];

// Mock AI Analysis Function
const mockAIAnalysis = (stressLevel, emotion) => {
  let recommendations = [];
  
  // Base on emotion
  if (emotion === 'Anxious') {
    recommendations = [
      { title: "Deep Breathing", type: "exercise", content: "Try the 4-7-8 breathing technique." },
      { title: "Grounding Exercise", type: "exercise", content: "Name 5 things you can see, 4 you can touch, etc." }
    ];
  } else if (emotion === 'Tired') {
    recommendations = [
      { title: "Sleep Hygiene Tips", type: "action", content: "Avoid screens 1 hour before bed, keep room cool." },
      { title: "Short Nap", type: "action", content: "Take a 20-minute power nap if possible." }
    ];
  } else if (emotion === 'Angry') {
    recommendations = [
      { title: "Grounding Exercise", type: "exercise", content: "Count to 10 slowly, focus on breathing." },
      { title: "Physical Activity", type: "action", content: "Go for a walk or do light exercise." }
    ];
  } else if (emotion === 'Calm') {
    recommendations = [
      { title: "Mindful Walk", type: "exercise", content: "Take a 10-minute walk without your phone." },
      { title: "Gratitude Journal", type: "action", content: "Write down 3 things you are grateful for." }
    ];
  } else if (emotion === 'Happy') {
    recommendations = [
      { title: "Share Joy", type: "action", content: "Share your happiness with someone." },
      { title: "Light Meditation", type: "exercise", content: "Enjoy a 5-minute gratitude meditation." }
    ];
  } else {
    recommendations = [
      { title: "General Relaxation", type: "exercise", content: "Try progressive muscle relaxation." }
    ];
  }
  
  return {
    summary: `Based on your emotion (${emotion}) and stress level (${stressLevel}), we recommend focusing on immediate relaxation.`,
    recommendations
  };
};

// @route   POST api/assessment
// @desc    Submit assessment & get analysis
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { answers, stressScore, emotion } = req.body;
    
    // If not provided, calculate from answers
    const finalStressScore = stressScore || parseInt(answers.stress) || 5;
    const finalEmotion = emotion || answers.mood || 'Calm';

    // AI Analysis
    const analysis = mockAIAnalysis(finalStressScore, finalEmotion);

    const assessment = {
      _id: Date.now().toString(),
      userId: req.user,
      answers,
      stressScore: finalStressScore,
      emotion: finalEmotion,
      aiAnalysis: JSON.stringify(analysis),
      timestamp: new Date()
    };
    assessments.push(assessment);

    res.json({ stressScore: finalStressScore, analysis });
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
    const userAssessments = assessments.filter(a => a.userId === req.user).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(userAssessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
