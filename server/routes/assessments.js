const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');

// @route   POST api/assessments
// @desc    Save a new assessment result
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newAssessment = new Assessment({
      user: req.user.id,
      score: req.body.score,
      level: req.body.level,
      answers: req.body.answers
    });

    const assessment = await newAssessment.save();
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/assessments
// @desc    Get all assessments for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort({ date: -1 });
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
