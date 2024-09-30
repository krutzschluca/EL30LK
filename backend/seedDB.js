require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

// Connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      //
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to insert dummy data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Patient.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();

    // Create hashed passwords
    const hashedPassword = await bcrypt.hash('pw123', 10);

    // Create users for patients and doctors
    const patient1 = await User.create({
      username: 'alice',
      password: hashedPassword,
      name: 'Alice Wonderland',
      phone: '111-111-1111',
      insuranceNumber: 'INS123',
      role: 'patient',
    });

    const patient2 = await User.create({
      username: 'bob',
      password: hashedPassword,
      name: 'Bob Marley',
      phone: '222-222-2222',
      insuranceNumber: 'INS456',
      role: 'patient',
    });

    const doctor1 = await User.create({
      username: 'Dr.JohnDoe',
      password: hashedPassword,
      name: 'Dr. John Doe',
      phone: '123-456-7890',
      role: 'doctor',
    });

    const doctor2 = await User.create({
      username: 'Dr.JaneSmith',
      password: hashedPassword,
      name: 'Dr. Jane Smith',
      phone: '098-765-4321',
      role: 'doctor',
    });

    // Create dummy appointments, using the IDs from created users and doctors
    await Appointment.create([
      {
        doctor: doctor1._id,
        patient: patient1._id,
        type: 'Checkup',
        date: new Date('2024-10-10T09:00:00.000Z'),
      },
      {
        doctor: doctor1._id,
        patient: patient2._id, 
        type: 'Extensive Care',
        date: new Date('2024-10-11T11:00:00.000Z'),
      },
      {
        doctor: doctor2._id,
        patient: patient1._id, 
        type: 'Operation',
        date: new Date('2024-10-12T13:00:00.000Z'),
      },
    ]);

    console.log('Database seeded with dummy data');
    process.exit();
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

// Connect to DB and seed the database
connectDB().then(seedDatabase);
