const express = require('express');
const { auth, authorize } = require('../middleware/auth');  // Import auth and authorize middleware
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Route for patients to view their own appointments
router.get('/my-appointments', auth, authorize(['patient']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your appointments' });
  }
});

// Route for patients to create a new appointment
router.post('/my-appointments', auth, authorize(['patient']), async (req, res) => {
  const { doctorId, type, date } = req.body;
  const appointmentDate = new Date(date);

  // Helper function to validate if the time is a valid 30-minute slot
  const isValidTimeSlot = (date) => {
    const minutes = date.getMinutes();
    return minutes === 0 || minutes === 30;
  };

  // Validate the time slot is on a 30-minute interval
  if (!isValidTimeSlot(appointmentDate)) {
    return res.status(400).json({ message: 'Invalid time slot. Please select a time on the hour or half-hour.' });
  }

  try {
    const existingAppointments = await Appointment.find({ date: appointmentDate });
    if (existingAppointments.length >= 2) {
      return res.status(400).json({ message: 'No rooms available at this time' });
    }

    const appointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      type,
      date: appointmentDate
    });
    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
});

// Route for patients to cancel their own appointment
router.delete('/my-appointments/:id', auth, authorize(['patient']), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    // Ensure the appointment belongs to the logged-in patient
    if (!appointment || appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only cancel your own appointments.' });
    }

    await appointment.remove();
    res.json({ message: 'Appointment canceled' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling appointment', error });
  }
});

// Route for secretaries to delete a patient by their ID
router.delete('/patients/:id', auth, authorize(['secretary']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete the patient
    await patient.remove();

    // Optionally, delete the associated user record too
    await User.findByIdAndDelete(patient._id);  // assuming patient ID is same as user ID

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error });
  }
});

module.exports = router;
