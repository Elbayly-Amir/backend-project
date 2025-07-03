const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const User = require('../src/models/User');
const Appointment = require('../src/models/Appointment');
require('dotenv').config();

describe('API /api/appointments', () => {

    let doctor, patient, doctorToken, patientToken;

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DATABASE_URL);
    });

    // Prepare the database before each test
    beforeEach(async () => {
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        await Appointment.deleteMany({});

        const doctorUser = await new User({ email: 'doctor@test.com', password: 'password123456', role: 'doctor' }).save();
        doctor = await Doctor.create({ _id: doctorUser._id, firstName: 'Dr.', lastName: 'Test', specialty: 'Testing' });
        let resDoc = await request(app).post('/api/auth/login').send({ email: 'doctor@test.com', password: 'password123456' });
        doctorToken = resDoc.body.data.token;

        const patientUser = await new User({ email: 'patient@test.com', password: 'password123456', role: 'patient' }).save();
        patient = await Patient.create({ _id: patientUser._id, user: patientUser._id, firstName: 'Patient', lastName: 'Test' });
        let resPat = await request(app).post('/api/auth/login').send({ email: 'patient@test.com', password: 'password123456' });
        patientToken = resPat.body.data.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /', () => {
        it('should enable a connected patient to create an appointment', async () => {
            const appointmentData = {
                doctorId: doctor._id,
                date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                reason: 'Test reason'
            };

            const response = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${patientToken}`)
                .send(appointmentData);

            expect(response.statusCode).toBe(201);
            expect(response.body.data.patient).toBe(patient._id.toString());
            expect(response.body.data.doctor).toBe(doctor._id.toString());
        });
    });

    describe('GET /my-appointments', () => {
        it('should allow a doctor to see his own appointments', async () => {
            // Create an appointment for the doctor
            await Appointment.create({
                doctor: doctor._id,
                patient: patient._id,
                date: new Date()
            });

            const response = await request(app)
                .get('/api/appointments/my-appointments')
                .set('Authorization', `Bearer ${doctorToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].doctor).toBe(doctor._id.toString());
            expect(response.body.data[0].patient.firstName).toBe('Patient');
        });
    });
});