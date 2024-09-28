const Patient = require('./models/Patient');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const mongoose = require('mongoose');
require('dotenv').config();

const clearDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      //
    });

    // Clear specific collections
    await Patient.deleteMany({});
    await User.deleteMany({});
    await Appointment.deleteMany({});

    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

clearDatabase();
