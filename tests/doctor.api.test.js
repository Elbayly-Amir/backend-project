const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const Review = require('../src/models/Review');
require('dotenv').config();

describe('API for Doctors', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  // The beforeEach hook is used to clear the database before each test
  beforeEach(async () => {
    await Doctor.deleteMany({});
     await Patient.deleteMany({});
    await Review.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test for POST /api/doctors
  describe('POST /', () => {
    it('devrait créer un nouveau profil de docteur et renvoyer un statut 201', async () => {
      const newDoctorData = { firstName: 'Marie', lastName: 'Curie', specialty: 'Radiologie' };
      const response = await request(app).post('/api/doctors').send(newDoctorData);
      
      expect(response.statusCode).toBe(201);
      expect(response.body.data.firstName).toBe(newDoctorData.firstName);
      expect(response.body.data._id).toBeDefined();
    });

    it('should return a status of 400 if a required field is missing', async () => {
      const invalidDoctorData = { firstName: 'Marie', specialty: 'Radiologie' };
      const response = await request(app).post('/api/doctors').send(invalidDoctorData);
      expect(response.statusCode).toBe(400);
    });
  });

  // Test for GET /api/doctors
  describe('GET /', () => {
    it('should return a list of all doctors', async () => {
      // A doctor is inserted into the test DB
      await Doctor.create({ firstName: 'Louis', lastName: 'Pasteur', specialty: 'Microbiologie' });
      const response = await request(app).get('/api/doctors');

      // The response is checked to ensure it has a status code of 200
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].firstName).toBe('Louis');
    });
  });

  // Test for GET /:id
  // This endpoint retrieves a single doctor by ID
  describe('GET /:id', () => {
    it('should return a single doctor if the ID is valid', async () => {
      const doctor = await Doctor.create({ firstName: 'Alexander', lastName: 'Fleming', specialty: 'Bactériologie' });
      const response = await request(app).get(`/api/doctors/${doctor._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.lastName).toBe('Fleming');
    });

    it('should return a 404 status if the ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/doctors/${nonExistentId}`);
      expect(response.statusCode).toBe(404);
    });
  });

  // Test for PATCH /:id
  // This endpoint updates a doctor's profile
  describe('PATCH /:id', () => {
    it('should update a doctor, including complex fields', async () => {
      const doctor = await Doctor.create({ firstName: 'Rosalind', lastName: 'Franklin', specialty: 'Biophysique' });
      const updates = {
        location: { city: 'Londres' },
        experiences: [{ position: 'Chercheuse', hospital: 'King\'s College' }]
      };

      const response = await request(app).patch(`/api/doctors/${doctor._id}`).send(updates);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.location.city).toBe('Londres');
      expect(response.body.data.experiences.length).toBe(1);
      expect(response.body.data.experiences[0].position).toBe('Chercheuse');
    });
  });

  // Test for GET /:id (Complete Profile)
  // This endpoint retrieves a complete profile of a doctor, including patients, reviews, and connections
  describe('GET /:id (Complete Profile)', () => {
    it('should return the doctor complete profile with patients, reviews and connections', async () => {
      // 1. PRÉPARATION : C'est l'étape la plus importante. On crée un écosystème de données.
      const doctorPrincipal = await Doctor.create({ firstName: 'Marie', lastName: 'Curie', specialty: 'Physique' });
      const doctorConnecte = await Doctor.create({ firstName: 'Pierre', lastName: 'Curie', specialty: 'Physique' });
      
      doctorPrincipal.doctorsConnection.push(doctorConnecte._id);
      await doctorPrincipal.save();

      const patient = await Patient.create({ firstName: 'Irène', lastName: 'Joliot-Curie', doctor: doctorPrincipal._id });
      await Review.create({ rating: 5, comment: 'Travail révolutionnaire sur la radioactivité.', doctor: doctorPrincipal._id, patient: patient._id });

      const response = await request(app).get(`/api/doctors/${doctorPrincipal._id}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.lastName).toBe('Curie');
      expect(response.body.doctorsConnection.length).toBe(1);
      expect(response.body.doctorsConnection[0].lastName).toBe('Curie');
      expect(response.body.patients.length).toBe(1);
      expect(response.body.patients[0].firstName).toBe('Irène');
      expect(response.body.reviews.length).toBe(1);
      expect(response.body.reviews[0].rating).toBe(5);
    });
  });

  // Test for DELETE /:id
  describe('DELETE /:id', () => {
    it('devrait supprimer un docteur et renvoyer un statut 204', async () => {
      const doctor = await Doctor.create({ firstName: 'Isaac', lastName: 'Newton', specialty: 'Physique' });
      const response = await request(app).delete(`/api/doctors/${doctor._id}`);
      expect(response.statusCode).toBe(204);
      const doctorInDb = await Doctor.findById(doctor._id);
      expect(doctorInDb).toBeNull();
    });
  });

});