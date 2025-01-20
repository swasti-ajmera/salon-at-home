const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// User login or registration
router.post('/login', async (req, res) => {
  const { email, name, photo } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({ email, name, photo });
      await user.save();
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;