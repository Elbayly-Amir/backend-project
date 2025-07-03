const appointmentService = require('../../services/appointmentService');

const createAppointment = async (req, res) => {
    try {
        // the id of the patient comes from the authenticated user
        const patientId = req.user.id; 
        const { doctorId, date, reason } = req.body;

        const appointmentData = { doctorId, patientId, date, reason };
        const appointment = await appointmentService.bookAppointment(appointmentData);

        res.status(201).json({
            status: 'success',
            data: appointment,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

const getMyDoctorAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.findAppointmentsForDoctor(req.user.id);
        res.status(200).json({
            status: 'success',
            data: appointments,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

module.exports = {
    createAppointment,
    getMyDoctorAppointments,
};
