const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Return user without password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, dob, profession, bio } = req.body;

  // Build user object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (dob) profileFields.dob = dob;
  if (profession) profileFields.profession = profession;
  if (bio) profileFields.bio = bio;

  try {
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @route   POST api/auth/signup
router.post('/signup', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  console.log('Signup Attempt:', req.body.email); // Debug Log
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Signup Validation Errors:', errors.array()); // Debug Log
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      console.log('Signup Failed: User already exists', email); // Debug Log
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    await user.save();
    console.log('Signup Success:', user.id); // Debug Log

    const token = generateToken(user.id);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  console.log('Login Attempt:', req.body.email); // Debug Log
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Login Failed: User not found', email); // Debug Log
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('Login Failed: Invalid Password', email); // Debug Log
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = generateToken(user.id);
    console.log('Login Success:', user.id); // Debug Log

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
