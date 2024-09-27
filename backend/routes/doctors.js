const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Route for doctors to view their own appointments
router.get('/doctor-appointments', auth, authorize(['doctor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your appointments' });
  }
});

module.exports = router;
