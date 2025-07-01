const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const addPatientToDoctor = async (patientData) => {

    const doctorExists = await Doctor.findById(patientData.doctor);
    if (!doctorExists) {
        throw new Error('Doctor not found');
    }

    const newPatient = new Patient(patientData);
    await newPatient.save();
    return newPatient;
};

const findPatientsByDoctor = async (doctorId) => {
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
        throw new Error('Doctor not found');
    }

    const patients = await Patient.find({ doctor: doctorId });
    return patients;
};

module.exports = {
    addPatientToDoctor,
    findPatientsByDoctor,
};
