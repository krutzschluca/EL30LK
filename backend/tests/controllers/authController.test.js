const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../../server'); 
const User = require('../../models/User');
const Patient = require('../../models/Patient');

describe('Auth Controller', () => {
  let server;
  let createdUserId;
  let existingUserId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const dbUri = 'mongodb://localhost:27017/clinic-appointment-test'; // Use test DB
      await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    server = app.listen(5001, () => {
      console.log('Test server running on port 5001');
    });
  });

  afterEach(async () => {
    // Delete created users after each test
    if (createdUserId) {
      await User.findByIdAndDelete(createdUserId);
      await Patient.deleteMany({ name: 'John Doe' }); // Remove test patient data based on unique field.
    }
    
    // Delete existing user used in the 'username already exists' test
    if (existingUserId) {
      await User.findByIdAndDelete(existingUserId);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe('POST /register', () => {
    it('should register a new patient', async () => {
      const res = await request(server)
        .post('/api/users/register')
        .send({
          username: 'testPatient',
          password: 'TestPassword123',
          name: 'John Doe',
          phone: '1234567890',
          insuranceNumber: 'INS123456',
          role: 'patient'
        });
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();

      const savedUser = await User.findOne({ username: 'testPatient' });
      createdUserId = savedUser._id; // Store the ID to delete it after the test.
      expect(savedUser).not.toBeNull();
    });

    it('should return error if username already exists', async () => {
      const existingUser = await User.create({
        username: 'existingUser',
        password: await bcrypt.hash('password', 10),
        role: 'patient',
      });
      existingUserId = existingUser._id; // Save the existing user ID to delete it later

      const res = await request(server)
        .post('/api/users/register')
        .send({
          username: 'existingUser',
          password: 'password',
          name: 'Jane Doe',
          role: 'patient',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Username already exists');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      const user = await User.create({
        username: 'loginTestUser',
        password: hashedPassword,
        role: 'patient',
      });
      createdUserId = user._id;  // Store the ID to delete it after the test.
    });

    it('should login successfully and return a token', async () => {
      const res = await request(server)
        .post('/api/users/login')
        .send({
          username: 'loginTestUser',
          password: 'testpassword',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should return error if username is not found', async () => {
      const res = await request(server)
        .post('/api/users/login')
        .send({
          username: 'nonExistentUser',
          password: 'password',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User not found');
    });

    it('should return error if password is incorrect', async () => {
      const res = await request(server)
        .post('/api/users/login')
        .send({
          username: 'loginTestUser',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });
});
