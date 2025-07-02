const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const Review = require('../src/models/Review');
require('dotenv').config();

describe('API for Reviews', () => {

  let doctorOne, doctorTwo, testPatient;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Review.deleteMany({});

    doctorOne = await Doctor.create({ firstName: 'Docteur Un', lastName: 'Ab', specialty: 'Test' });
    doctorTwo = await Doctor.create({ firstName: 'Docteur Deux', lastName: 'Ba', specialty: 'Test' });
    testPatient = await Patient.create({ firstName: 'Patient Test', lastName: 'Pi', doctor: doctorOne._id });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test for POST /api/reviews
  describe('POST /api/reviews', () => {
     it('should create a new notice', async () => {
        const newReviewData = { rating: 5, comment: 'Excellent.', doctor: doctorOne._id, patient: testPatient._id };
        const response = await request(app).post('/api/reviews').send(newReviewData);

        expect(response.statusCode).toBe(201);
        expect(response.body.data.rating).toBe(5);
    });
  });

 
  // Test to get all reviews of a specific doctor
  describe('GET /api/doctors/:doctorId/reviews', () => {
    it('should return only the advice of the specified doctor', async () => {
      await Review.create({ rating: 5, comment: 'Review 1 for Dr One', doctor: doctorOne._id, patient: testPatient._id });
      await Review.create({ rating: 4, comment: 'Review 2 for Dr One', doctor: doctorOne._id, patient: testPatient._id });
      await Review.create({ rating: 3, comment: 'Review fot Dr Deux', doctor: doctorTwo._id, patient: testPatient._id });

      const response = await request(app).get(`/api/doctors/${doctorOne._id}/reviews`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].comment).toContain('Dr Un');
      expect(response.body.data[1].comment).toContain('Dr Un');
    });
  });
});