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

// GET specific salon details with all information
router.get('/api/salons/all/:id', async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }
        res.json(salon);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salon details', error: error.message });
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

// PUT endpoint to update salon details
router.put('/api/salons/:id', async (req, res) => {
    try {
        // First check if the salon exists
        const existingSalon = await Salon.findById(req.params.id);
        if (!existingSalon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        // Extract the updated data from request body
        const {
            name,
            description,
            phone,
            email,
            addressLine,
            suburb,
            openingTime,
            closingTime,
            categoriesAndServices
        } = req.body;

        // Validate that categoriesAndServices has the correct structure
        if (categoriesAndServices && !Array.isArray(categoriesAndServices)) {
            return res.status(400).json({ 
                message: 'categoriesAndServices must be an array'
            });
        }

        // Create the update object
        const updateData = {
            name,
            description,
            phone,
            email,
            addressLine,
            suburb,
            openingTime,
            closingTime,
            categoriesAndServices: categoriesAndServices.map(category => ({
                category: category.category,
                services: category.services
            }))
        };

        // Update the salon with the new data
        const updatedSalon = await Salon.findByIdAndUpdate(
            req.params.id,
            updateData,
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run schema validators
            }
        );

        res.json(updatedSalon);

    } catch (error) {
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                error: error.message 
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid salon ID', 
                error: error.message 
            });
        }
        res.status(500).json({ 
            message: 'Error updating salon', 
            error: error.message 
        });
    }
});

module.exports = router;