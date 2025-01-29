const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");

// User login or registration
router.post("/login", async (req, res) => {
  const { email, name, photo } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      // If the user doesn't exist, create a new one
      admin = new Admin({ email, name, photo });
      await admin.save();
      return res
        .status(200)
        .json({
          message: "Admin created",
          redirectTo: "/salonDetails.html",
        });
    }
    // Check if salon details are completed
    if (!admin.salonDetailsCompleted) {
      return res
        .status(200)
        .json({
          message: "Salon details not completed",
          redirectTo: "/salonDetails.html",
        });
    }

    // If salon details are completed, redirect to dashboard
    res
      .status(200)
      .json({
        message: "Admin login successful",
        salon: admin.salon,
        redirectTo: "/adminDashboard.html",
      });
      
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
