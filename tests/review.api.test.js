const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const Review = require('../src/models/Review');
const User = require('../src/models/User');
require('dotenv').config();

describe('API for Reviews', () => {

  let doctorOne, patientUser, patientToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Review.deleteMany({});

    const userDoc = await new User({ email: 'doc@test.com', password: 'password123456', role: 'doctor' }).save();
    doctorOne = await Doctor.create({ _id: userDoc._id, firstName: 'Docteur', lastName: 'Un', specialty: 'Test' });

    patientUser = await new User({ email: 'patient@test.com', password: 'password123456', role: 'patient' }).save();
    await Patient.create({ _id: patientUser._id, user: patientUser._id, firstName: 'Patient', lastName: 'Test' });

    const res = await request(app).post('/api/auth/login').send({ email: 'patient@test.com', password: 'password123456' });
    patientToken = res.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/reviews', () => {
     it('should allow a logged-in user to create a notification', async () => {
        const newReviewData = { rating: 5, comment: 'Excellent.', doctor: doctorOne._id, patient: patientUser._id };
        const response = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${patientToken}`)
            .send(newReviewData);

        expect(response.statusCode).toBe(201);
        expect(response.body.data.rating).toBe(5);
    });
  });

  describe('GET /api/doctors/:doctorId/reviews', () => {
    it('should return the specified doctor reviews', async () => {
      await Review.create({ rating: 5, comment: 'Avis 1', doctor: doctorOne._id, patient: patientUser._id });
      
      const response = await request(app)
        .get(`/api/doctors/${doctorOne._id}/reviews`)
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });
});
