const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
