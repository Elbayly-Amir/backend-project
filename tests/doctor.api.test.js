const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const Review = require('../src/models/Review');
require('dotenv').config();

describe('API /api/doctors', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  // La fonction beforeEach est très utile car elle nous assure une base de données propre avant chaque test.
  beforeEach(async () => {
    await Doctor.deleteMany({});
     await Patient.deleteMany({});
    await Review.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // --- Test du endpoint POST / ---
  describe('POST /', () => {
    it('devrait créer un nouveau profil de docteur et renvoyer un statut 201', async () => {
      const newDoctorData = { firstName: 'Marie', lastName: 'Curie', specialty: 'Radiologie' };
      const response = await request(app).post('/api/doctors').send(newDoctorData);
      
      expect(response.statusCode).toBe(201);
      expect(response.body.data.firstName).toBe(newDoctorData.firstName);
      expect(response.body.data._id).toBeDefined();
    });

    it('devrait renvoyer un statut 400 si un champ requis est manquant', async () => {
      const invalidDoctorData = { firstName: 'Marie', specialty: 'Radiologie' };
      const response = await request(app).post('/api/doctors').send(invalidDoctorData);
      expect(response.statusCode).toBe(400);
    });
  });

  // --- Test du endpoint GET / ---
  describe('GET /', () => {
    it('devrait renvoyer une liste de tous les docteurs', async () => {
      // 1. Préparation : on insère un docteur dans la BDD de test
      await Doctor.create({ firstName: 'Louis', lastName: 'Pasteur', specialty: 'Microbiologie' });

      // 2. Action
      const response = await request(app).get('/api/doctors');

      // 3. Assertions
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true); // On vérifie que .data est bien un tableau
      expect(response.body.data.length).toBe(1); // On vérifie la longueur du tableau dans .data
      expect(response.body.data[0].firstName).toBe('Louis');
    });
  });

  // --- Test du endpoint GET /:id ---
  describe('GET /:id', () => {
    it('devrait renvoyer un seul docteur si l\'ID est valide', async () => {
      // 1. Préparation
      const doctor = await Doctor.create({ firstName: 'Alexander', lastName: 'Fleming', specialty: 'Bactériologie' });

      // 2. Action
      const response = await request(app).get(`/api/doctors/${doctor._id}`);

      // 3. Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.lastName).toBe('Fleming');
    });

    it('devrait renvoyer un statut 404 si l\'ID n\'existe pas', async () => {
      const nonExistentId = new mongoose.Types.ObjectId(); // Crée un ID MongoDB valide mais qui n'existe pas
      const response = await request(app).get(`/api/doctors/${nonExistentId}`);
      expect(response.statusCode).toBe(404);
    });
  });

  // --- Test du endpoint PATCH /:id ---
  describe('PATCH /:id', () => {
    it('devrait mettre à jour un docteur, y compris les champs complexes', async () => {
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

  describe('GET /:id (Profil Complet)', () => {
    it('devrait renvoyer le profil complet du docteur avec ses patients, avis et connexions', async () => {
      // 1. PRÉPARATION : C'est l'étape la plus importante. On crée un écosystème de données.
      const doctorPrincipal = await Doctor.create({ firstName: 'Marie', lastName: 'Curie', specialty: 'Physique' });
      const doctorConnecte = await Doctor.create({ firstName: 'Pierre', lastName: 'Curie', specialty: 'Physique' });
      
      // On lie le docteur connecté au docteur principal
      doctorPrincipal.doctorsConnection.push(doctorConnecte._id);
      await doctorPrincipal.save();

      const patient = await Patient.create({ firstName: 'Irène', lastName: 'Joliot-Curie', doctor: doctorPrincipal._id });
      await Review.create({ rating: 5, comment: 'Travail révolutionnaire sur la radioactivité.', doctor: doctorPrincipal._id, patient: patient._id });

      // 2. ACTION : On appelle l'endpoint
      const response = await request(app).get(`/api/doctors/${doctorPrincipal._id}`);
      
      // 3. ASSERTIONS : On vérifie que toutes les pièces du puzzle sont là
      expect(response.statusCode).toBe(200);

      // Vérifier le docteur lui-même
      expect(response.body.lastName).toBe('Curie');

      // Vérifier la connexion peuplée
      expect(response.body.doctorsConnection.length).toBe(1);
      expect(response.body.doctorsConnection[0].lastName).toBe('Curie');

      // Vérifier les patients
      expect(response.body.patients.length).toBe(1);
      expect(response.body.patients[0].firstName).toBe('Irène');
      
      // Vérifier les avis
      expect(response.body.reviews.length).toBe(1);
      expect(response.body.reviews[0].rating).toBe(5);
    });
  });

  // --- Test du endpoint DELETE /:id ---
  describe('DELETE /:id', () => {
    it('devrait supprimer un docteur et renvoyer un statut 204', async () => {
      // 1. Préparation
      const doctor = await Doctor.create({ firstName: 'Isaac', lastName: 'Newton', specialty: 'Physique' });

      // 2. Action
      const response = await request(app).delete(`/api/doctors/${doctor._id}`);

      // 3. Assertions
      expect(response.statusCode).toBe(204);

      // On vérifie en plus que le docteur n'est plus dans la base de données
      const doctorInDb = await Doctor.findById(doctor._id);
      expect(doctorInDb).toBeNull();
    });
  });

});