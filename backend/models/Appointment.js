const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  type: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'Scheduled' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
