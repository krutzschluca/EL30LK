const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
const patientRoutes = require('./routes/patients');        // Import patient routes
const appointmentRoutes = require('./routes/appointments'); // Import appointment routes
const userRoutes = require('./routes/users');  // Import user routes

// Use the routes
app.use('/api', patientRoutes);        // All patient routes
app.use('/api', appointmentRoutes);    // All appointment routes
app.use('/api/users', userRoutes);   // User routes for registration and login

// Default route
app.get('/', (req, res) => {
  res.send('Clinic Appointment System API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
