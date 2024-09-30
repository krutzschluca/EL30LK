const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// Helper function to check if the appointment time is valid (on a 30-minute interval)
const isValidTimeSlot = (date) => {
  const minutes = date.getMinutes();
  return minutes === 0 || minutes === 30;  // Valid times are xx:00 or xx:30
};

// Helper function to check availability (This is a placeholder; logic can be more complex)
const generateAvailableSlots = (doctorId, appointments) => {
  const workingHours = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];
  
  const bookedSlots = appointments.map(appt => new Date(appt.date).toISOString().substring(11, 16));
  const availableSlots = workingHours.filter(slot => !bookedSlots.includes(slot));
  
  return availableSlots;
};

// Route for secretaries to manage all appointments (view)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'username') // Populate doctor information
      .populate('patient', 'username '); // Populate patient information

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Route to fetch appointments for the logged-in user (patient)
router.get('/my-appointments', auth, async (req, res) => {
  try {
    // Assuming the appointments are linked to the patient ID via the "patient" field
    const appointments = await Appointment.find({ patient: req.user.id })  // Use req.user.id to fetch only this user's appointments
      .populate('doctor', 'username')  // Populate the doctor's info, like their name or username
      .populate('patient', 'username');  // Optionally, populate patient details

    if (!appointments) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

module.exports = router;

// Route for patients to view available slots for a doctor
router.get('/available-slots/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Find all appointments for the selected doctor
    const appointments = await Appointment.find({ doctor: doctorId });

    // Generate available slots (excluding already booked times)
    const availableSlots = generateAvailableSlots(doctorId, appointments);

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error });
  }
});

// Route to create a new appointment (used by patients or secretaries)
router.post('/', async (req, res) => {
  console.log('POST /appointments hit');
  const { doctorId, patientId, type, date } = req.body;

  // Convert the incoming date string to a JavaScript Date object
  const appointmentDate = new Date(date);

  // Validate the time slot is on a 30-minute interval
  if (!isValidTimeSlot(appointmentDate)) {
    return res.status(400).json({ message: 'Invalid time slot. Please select a time on the hour or half-hour.' });
  }

  try {
    // Check how many appointments are already scheduled at the same time
    const existingAppointments = await Appointment.find({ date: appointmentDate });

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

// Route for secretaries to cancel appointments
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment canceled' });
  } catch (error) {
    console.log("Error in deleting appointment:", error);
    res.status(500).json({ message: 'Error canceling appointment', error: error.message });
  }
});

module.exports = router;
