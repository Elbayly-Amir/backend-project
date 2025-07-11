const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const patientController = require('../controllers/patientController');
const reviewController = require('../controllers/reviewController');
const {protect, authorize} = require('../../middlewares/authMiddleware');


// Public routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorProfile);
// Protect routes that require authentication
router.post('/', protect, doctorController.createDoctor);
router.patch('/:id', protect, authorize('doctor'), doctorController.updateDoctor);
router.delete('/:id', protect,  authorize('doctor'), doctorController.deleteDoctor);
router.get('/:doctorId/patients', protect, patientController.getPatientsByDoctor);
router.get('/:doctorId/reviews', protect, reviewController.getReviewsByDoctor);

module.exports = router;