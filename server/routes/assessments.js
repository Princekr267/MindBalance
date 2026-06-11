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
      answers: req.body.answers,
      mood: req.body.mood,
      symptoms: req.body.symptoms,
      triggers: req.body.triggers,
      intensity: req.body.intensity
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

// @route   DELETE api/assessments/:id
// @desc    Delete an assessment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }

    // Make sure user owns assessment
    if (assessment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await assessment.deleteOne();

    res.json({ msg: 'Assessment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
