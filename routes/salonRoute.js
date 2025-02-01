const express = require('express');
const router = express.Router();
const Salon = require('../models/salonSchema');
const Admin = require('../models/adminModel');

// Route to handle salon details submission
router.post('/', async (req, res) => {
  const {
    name,
    description,
    phone,
    email,
    addressLine,
    suburb,
    openingTime,
    closingTime,
    categoriesAndServices,
  } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    // Create a new salon document
    const newSalon = new Salon({
      name,
      description,
      phone,
      email,
      addressLine,
      suburb,
      openingTime,
      closingTime,
      categoriesAndServices,
      admin: admin._id, // Reference the admin ID
    });

    // Save the new salon
    await newSalon.save();

    // Update the admin's salon reference and mark details as completed
    admin.salon = newSalon._id;
    admin.salonDetailsCompleted = true;
    await admin.save();

    res.status(200).json({ message: "Salon details submitted successfully" });
  } catch (error) {
    console.error("Error storing salon details:", error);
    res.status(500).json({ error: "Failed to submit salon details" });
  }
});

// Add more salon-related routes here if needed (e.g., salon update, deletion)

module.exports = router;
