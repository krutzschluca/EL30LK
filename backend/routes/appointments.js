const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Helper function to check if the appointment time is valid (on a 30-minute interval)
const isValidTimeSlot = (date) => {
  const minutes = date.getMinutes();
  return minutes === 0 || minutes === 30;  // Valid times are xx:00 or xx:30
};

// Route to create a new appointment
router.post('/appointments', async (req, res) => {
  const { doctorId, patientId, type, date } = req.body;

    // Convert the incoming date string to a JavaScript Date object
    const appointmentDate = new Date(date);

    // Validate the time slot is on a 30-minute interval
  if (!isValidTimeSlot(appointmentDate)) {
    return res.status(400).json({ message: 'Invalid time slot. Please select a time on the hour or half-hour.' });
  }

  try {
    // Check how many appointments are already scheduled at the same time
    const existingAppointments = await Appointment.find({ date });
    
    // If 2 or more appointments are already booked for this time slot, return an error
    if (existingAppointments.length >= 2) {
      return res.status(400).json({ message: 'No rooms available at this time' });
    }

    // Otherwise, create the new appointment
    const appointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      type,
      date: appointmentDate
    });
    await appointment.save();

    // Update doctor and patient records
    await Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: appointment._id } });
    await Patient.findByIdAndUpdate(patientId, { $push: { appointments: appointment._id } });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
});

module.exports = router;