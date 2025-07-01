const patientService = require('../../services/patientService');

const createPatient = async (req, res) => {
    try {
        const patient = await patientService.addPatientToDoctor(req.body);
        res.status(201).json({
            status: 'success',
            data: patient
        }); 
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

const getPatientsByDoctor = async (req, res) => {
    try {
        const patients = await patientService.findPatientsByDoctor(req.params.doctorId);
        res.status(200).json({
            status: 'success',
            data: patients
        });
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = {
    createPatient,
    getPatientsByDoctor,
};