const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');
const Salon = require('../models/salonSchema');

router.post('/', async (req, res) => {
  const { salon, name, phone, user, service, date, time } = req.body;
  
  try {
    // Find salon to validate hours
    const salonDetails = await Salon.findById(salon);
    if (!salonDetails) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    // Convert time to Date for comparison
    const appointmentDateTime = new Date(`${date}T${time}`);
    const [openHour, openMinute] = salonDetails.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = salonDetails.closingTime.split(':').map(Number);

    const openTime = new Date(appointmentDateTime);
    openTime.setHours(openHour, openMinute, 0);
    
    const closeTime = new Date(appointmentDateTime);
    closeTime.setHours(closeHour, closeMinute, 0);

    // Check if appointment is within salon hours
    if (appointmentDateTime < openTime || appointmentDateTime > closeTime) {
      return res.status(400).json({ 
        error: `Appointments must be between ${salonDetails.openingTime} and ${salonDetails.closingTime}` 
      });
    }
    // Check for existing appointments at the same time
    const existingAppointment = await Appointment.findOne({ 
      salon, 
      date, 
      time,
      status: { $ne: 'Rejected' } 
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      salon,
      name,
      phone,
      user,
      service,
      date,
      time
    });

    await newAppointment.save();
    res.status(201).json({ 
      message: 'Appointment request sent', 
      appointment: newAppointment 
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment request', details: error.message });
  }
});

router.get(`/:salonId`, async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      salon: req.params.salonId, 
    }).populate('user', 'name email');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Other routes remain the same
router.get(`/pending/:salonId`, async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      salon: req.params.salonId, 
      status: 'Pending' 
    }).populate('user', 'name email');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending appointments' });
  }
});

router.put('/:appointmentId/respond', async (req, res) => {
  const { status, rejectionReason } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId, 
      { 
        status, 
        rejectionReason: status === 'Rejected' ? rejectionReason : null 
      },
      { new: true }
    );
    res.status(200).json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

module.exports = router;