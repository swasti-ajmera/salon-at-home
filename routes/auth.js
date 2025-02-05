const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// User login or registration
router.post('/login', async (req, res) => {
  const { email, name, photoURL } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({ email, name, photoURL });
      await user.save();
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
});

router.put('/:userId', async (req, res) => {
  const { name, email } = req.body;
  
  // Validate request body
  if (!name && !email) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
  }

  try {
      // Create update object with only provided fields
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      // Find and update the user
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $set: updateData },
          { new: true, runValidators: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully', user });
  } catch (error) {
      if (error.name === 'ValidationError') {
          return res.status(400).json({ message: 'Invalid data provided', error: error.message });
      }
      res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

module.exports = router;