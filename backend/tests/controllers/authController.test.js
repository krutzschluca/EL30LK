const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../../server'); 
const User = require('../../models/User');
const Patient = require('../../models/Patient');

describe('Auth Controller', () => {
  let server;
  
  beforeAll(async () => {
      if (mongoose.connection.readyState === 0) {
          const dbUri = 'mongodb://localhost:27017/clinic-appointment-test'; // Use test DB
          await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
        }
    server = app.listen(5001, () => {
        console.log('Test server running on port 5001');
        });
  });
  
  beforeEach(async () => {
    await User.deleteMany({});
    await Patient.deleteMany({});
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
      expect(savedUser).not.toBeNull();
    });

    it('should return error if username already exists', async () => {
      await User.create({
        username: 'existingUser',
        password: await bcrypt.hash('password', 10),
        role: 'patient',
      });

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
      await User.create({
        username: 'loginTestUser',
        password: hashedPassword,
        role: 'patient',
      });
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
