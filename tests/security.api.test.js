const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const User = require('../src/models/User');
require('dotenv').config();

describe('Safety and Authorization Tests', () => {

    let doctorToken, patientToken, doctorA_Id, doctorB_Id;

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DATABASE_URL);
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Doctor.deleteMany({});

        // We use a valid password for testing
        const validPassword = 'password123456';

        const doctorA_User = await new User({ email: 'doctor.a@test.com', password: validPassword, role: 'doctor' }).save();
        doctorA_Id = doctorA_User._id;
        await Doctor.create({ _id: doctorA_Id, firstName: 'Docteur', lastName: 'Ab', specialty: 'Test' });
        let res = await request(app).post('/api/auth/login').send({ email: 'doctor.a@test.com', password: validPassword });
        doctorToken = res.body.data.token;

        const doctorB_User = await new User({ email: 'doctor.b@test.com', password: validPassword, role: 'doctor' }).save();
        doctorB_Id = doctorB_User._id;
        await Doctor.create({ _id: doctorB_Id, firstName: 'Docteur', lastName: 'Bb', specialty: 'Test' });

        const patientUser = await new User({ email: 'patient@test.com', password: validPassword, role: 'patient' }).save();
        res = await request(app).post('/api/auth/login').send({ email: 'patient@test.com', password: validPassword });
        patientToken = res.body.data.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Protection routes', () => {

        it('should block a request without a token (401 Unauthorized)', async () => {
            const response = await request(app)
                .patch(`/api/doctors/${doctorA_Id}`)
                .send({ specialty: 'Nouvelle Spécialité' });
            
            expect(response.statusCode).toBe(401);
        });

        it('should block a PATIENT who tries to modify a doctor profile (403 Forbidden)', async () => {
            const response = await request(app)
                .patch(`/api/doctors/${doctorA_Id}`)
                .set('Authorization', `Bearer ${patientToken}`)
                .send({ specialty: 'Nouvelle Spécialité' });
            
            expect(response.statusCode).toBe(403);
        });

        it('should block a DOCTOR who tries to modify the profile of another doctor (403 Forbidden)', async () => {
            const response = await request(app)
                .patch(`/api/doctors/${doctorB_Id}`)
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ specialty: 'Nouvelle Spécialité' });
            
            expect(response.statusCode).toBe(403);
        });

        it('should authorize a doctor to modify his/her own profile (200 OK)', async () => {
            const response = await request(app)
                .patch(`/api/doctors/${doctorA_Id}`)
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({ specialty: 'Cardiologie' });

            expect(response.statusCode).toBe(200);
            expect(response.body.data.specialty).toBe('Cardiologie');
        });
    });
});
