const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');  // Import the Patient model

// Route to create a new patient
router.post('/patients', async (req, res) => {
  const { name, phone, insuranceNumber } = req.body;
  try {
    const newPatient = new Patient({ name, phone, insuranceNumber });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error });
  }
});

module.exports = router;
