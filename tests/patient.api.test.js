const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
require('dotenv').config();

describe('API for Patients', () => {

  let doctorOne;
  let doctorTwo;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    // We create two doctors for testing
    doctorOne = await Doctor.create({ firstName: 'Hippocrate', lastName: 'de Cos', specialty: 'Médecine' });
    doctorTwo = await Doctor.create({ firstName: 'Galien', lastName: 'de Pergame', specialty: 'Anatomie' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test for POST /api/patients
  describe('POST /api/patients', () => {
    it('should create a new patient linked to an existing doctor', async () => {
      const newPatientData = {
        firstName: 'Periclès',
        lastName: 'Athènes',
        doctor: doctorOne._id
      };
      const response = await request(app).post('/api/patients').send(newPatientData);

      expect(response.statusCode).toBe(201);
      expect(response.body.data.firstName).toBe('Periclès');
      expect(response.body.data.doctor).toBe(doctorOne._id.toString());
    });
  });

  // Test to get all patients of a specific doctor
  describe('GET /api/doctors/:doctorId/patients', () => {
    it('should only refer patients of the specified doctor', async () => {
      await Patient.create({ firstName: 'Patient One', lastName: 'A', doctor: doctorOne._id });
      await Patient.create({ firstName: 'Patient Two', lastName: 'B', doctor: doctorOne._id });
      await Patient.create({ firstName: 'Patient Three', lastName: 'C', doctor: doctorTwo._id });

      const response = await request(app).get(`/api/doctors/${doctorOne._id}/patients`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(2);
      response.body.data.forEach(patient => {
        expect(patient.doctor.toString()).toBe(doctorOne._id.toString());
      });
    });
  });
});