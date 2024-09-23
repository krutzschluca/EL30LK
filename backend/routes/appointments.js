const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

// View all appointments (for secretaries)
router.get('/', auth, authorize(['secretary']), async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctor').populate('patient');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

module.exports = router;
