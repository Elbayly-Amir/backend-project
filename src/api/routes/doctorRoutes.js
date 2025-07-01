const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');

router.post('/', doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorProfile);
router.patch('/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);
router.get('/:doctorId/patients', patientController.getPatientsByDoctor);

module.exports = router;