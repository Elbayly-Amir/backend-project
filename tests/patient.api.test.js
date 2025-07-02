const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
require('dotenv').config();

describe('API des Patients', () => {

  let doctorOne;
  let doctorTwo;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    // On crée deux docteurs pour s'assurer que le filtre fonctionne bien
    doctorOne = await Doctor.create({ firstName: 'Hippocrate', lastName: 'de Cos', specialty: 'Médecine' });
    doctorTwo = await Doctor.create({ firstName: 'Galien', lastName: 'de Pergame', specialty: 'Anatomie' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // --- Tests POST /api/patients ---
  describe('POST /api/patients', () => {
    // ... votre test de création de patient est ici ...
    it('devrait créer un nouveau patient lié à un docteur existant', async () => {
      const newPatientData = {
        firstName: 'Periclès',
        lastName: 'd\'Athènes',
        doctor: doctorOne._id
      };
      const response = await request(app).post('/api/patients').send(newPatientData);

      expect(response.statusCode).toBe(201);
      expect(response.body.data.firstName).toBe('Periclès');
      expect(response.body.data.doctor).toBe(doctorOne._id.toString());
    });
  });

  // --- NOUVEAU BLOC DE TEST ---
  // Test de GET /api/doctors/:doctorId/patients
  describe('GET /api/doctors/:doctorId/patients', () => {
    it('devrait renvoyer uniquement les patients du docteur spécifié', async () => {
      // 1. Préparation : on crée des patients pour les deux docteurs
      await Patient.create({ firstName: 'Patient Un', lastName: 'A', doctor: doctorOne._id });
      await Patient.create({ firstName: 'Patient Deux', lastName: 'B', doctor: doctorOne._id });
      await Patient.create({ firstName: 'Patient Trois', lastName: 'C', doctor: doctorTwo._id });

      // 2. Action : on demande les patients du docteur "One"
      const response = await request(app).get(`/api/doctors/${doctorOne._id}/patients`);

      // 3. Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(2); // On doit avoir 2 patients, pas 3
      // On vérifie que tous les patients retournés appartiennent bien au bon docteur
      response.body.data.forEach(patient => {
        expect(patient.doctor.toString()).toBe(doctorOne._id.toString());
      });
    });
  });
});