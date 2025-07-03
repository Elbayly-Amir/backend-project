const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const User = require('../src/models/User');
require('dotenv').config();

describe('API for Patients (via Doctors)', () => {

  let doctorOne;
  let userToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    const userDoc = await new User({ email: 'doc@test.com', password: 'password123456', role: 'doctor' }).save();
    doctorOne = await Doctor.create({ _id: userDoc._id, firstName: 'Hippocrate', lastName: 'Cos', specialty: 'Médecine' });

    const userPatient = await new User({ email: 'patient@test.com', password: 'password123456', role: 'patient' }).save();
    await Patient.create({ _id: userPatient._id, user: userPatient._id, firstName: 'Patient', lastName: 'Un' });
    
    const res = await request(app).post('/api/auth/login').send({ email: 'patient@test.com', password: 'password123456' });
    userToken = res.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/doctors/:doctorId/patients', () => {
    it('should return the patient list if the user is authenticated', async () => {
      const response = await request(app)
        .get(`/api/doctors/${doctorOne._id}/patients`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(0); 
    });
  });
});