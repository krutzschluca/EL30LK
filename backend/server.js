const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
const patientRoutes = require('./routes/patients');          // Import patient routes
const appointmentRoutes = require('./routes/appointments');  // Import appointment routes
const userRoutes = require('./routes/users');                // Import user routes for registration and login
const doctorRoutes = require('./routes/doctors');            // Import doctor routes (if you have one)

// Use the routes
app.use('/api/patients', patientRoutes);         // All patient-related routes
app.use('/api/appointments', appointmentRoutes); // All appointment-related routes
app.use('/api/users', userRoutes);               // User-related routes for registration and login
app.use('/api/doctors', doctorRoutes);           // Doctor-related routes (if you have one)

// Default route
app.get('/', (req, res) => {
  res.send('Clinic Appointment System API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
