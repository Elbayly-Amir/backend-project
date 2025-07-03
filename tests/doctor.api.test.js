const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const User = require('../src/models/User');
const Patient = require('../src/models/Patient');
const Review = require('../src/models/Review');
require('dotenv').config();

describe('API /api/doctors', () => {
  let doctorToken;
  let doctorId;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Review.deleteMany({});

    // We create a doctor user and their profile
    const user = await new User({ email: 'test.doctor@test.com', password: 'password123456', role: 'doctor' }).save();
    await Doctor.create({ _id: user._id, firstName: 'Test', lastName: 'Doctor', specialty: 'Testing' });
    
    const res = await request(app).post('/api/auth/login').send({ email: 'test.doctor@test.com', password: 'password123456' });
    doctorToken = res.body.data.token;
    doctorId = user._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /', () => {
    it('should return a list of all doctors', async () => {
      const response = await request(app).get('/api/doctors');
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('PATCH /:id', () => {
    it('should update the connected doctor profile', async () => {
      const updates = { specialty: 'Cardiologie' };
      const response = await request(app)
        .patch(`/api/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${doctorToken}`) // We use the token
        .send(updates);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.specialty).toBe('Cardiologie');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete the connected doctor profile', async () => {
      const response = await request(app)
        .delete(`/api/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${doctorToken}`);

      expect(response.statusCode).toBe(204);
    });
  });

  describe('GET /:id (Profil Complet)', () => {
    it('should return the doctor complete profile', async () => {
      // We create a patient and a review for this doctor
      const patientUser = await new User({ email: 'patient@test.com', password: 'password123456', role: 'patient' }).save();
      const patient = await Patient.create({ _id: patientUser._id, user: patientUser._id, firstName: 'Test', lastName: 'Patient' });
      await Review.create({ rating: 5, comment: 'Excellent', doctor: doctorId, patient: patient._id });

      const response = await request(app).get(`/api/doctors/${doctorId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.patients.length).toBe(1);
      expect(response.body.reviews.length).toBe(1);
    });
  });
});
