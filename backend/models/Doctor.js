const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  availableHours: {
    type: [String], // e.g. ['8:00-12:00', '13:00-17:00']
    required: true
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
});

module.exports = mongoose.model('Doctor', doctorSchema);
