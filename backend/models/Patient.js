const mongoose = require('mongoose');

// Define the schema for a Patient
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  insuranceNumber: {
    type: String,
    required: true
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
});

module.exports = mongoose.model('Patient', patientSchema);
