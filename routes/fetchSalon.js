const express = require('express');
const Salon = require('../models/salonSchema'); // Mongoose model

const router = express.Router();

// GET all salons
router.get('/api/salons', async (req, res) => {
    try {
        const salons = await Salon.find()
            .select('name description openingTime closingTime');
        res.json(salons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salons', error: error.message });
    }
});

// GET specific salon details with services
router.get('/api/salons/:id', async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id)
            .select('name categoriesAndServices');
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }
        res.json(salon);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salon details', error: error.message });
    }
});

module.exports = router;