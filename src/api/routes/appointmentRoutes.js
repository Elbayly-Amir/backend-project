const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../../middlewares/authMiddleware');

// Only authenticated patients can create appointments
router.post('/', protect, authorize('patient'), appointmentController.createAppointment);
router.get('/my-appointments', protect, authorize('doctor'), appointmentController.getMyDoctorAppointments);

module.exports = router;