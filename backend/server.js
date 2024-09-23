const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Clinic Appointment System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/patients', async (req, res) => {
    const { name, phone, insuranceNumber } = req.body;
    try {
      const newPatient = new Patient({ name, phone, insuranceNumber });
      await newPatient.save();
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ message: 'Error creating patient', error });
    }
});
  
// Route to create a new appointment
app.post('/api/appointments', async (req, res) => {
    const { doctorId, patientId, type, date } = req.body;
    try {
      const appointment = new Appointment({
        doctor: doctorId,
        patient: patientId,
        type,
        date
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