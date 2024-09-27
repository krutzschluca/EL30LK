const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Get a list of all doctors
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }, 'username _id'); // Only return the doctor names and IDs
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

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
