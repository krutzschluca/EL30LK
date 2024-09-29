const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  insuranceNumber: { type: String },
  role: { type: String, enum: ['patient', 'doctor', 'secretary'], default: 'patient' },
});

module.exports = mongoose.model('User', userSchema);
