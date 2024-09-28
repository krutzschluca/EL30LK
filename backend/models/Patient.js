const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  phone: String,
  insuranceNumber: String,
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
