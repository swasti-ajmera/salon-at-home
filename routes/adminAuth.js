const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel');

// User login or registration
router.post('/login', async (req, res) => {
  const { email, name, photo } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      // If the user doesn't exist, create a new one
      admin = new Admin({ email, name, photo });
      await admin.save();
    }

    res.status(200).json({ message: 'Admin login successful', admin });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;