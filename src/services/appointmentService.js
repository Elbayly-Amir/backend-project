const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Service to handle appointment-related logic
const bookAppointment = async (appointmentData) => {
    const { doctorId, patientId, date, reason } = appointmentData;

    // Verify that the doctor exists
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
        throw new Error('The specified doctor doesn\'t exist.');
    }

    // Verify that the date is in the future
    if (new Date(date) < new Date()) {
        throw new Error('You cannot make appointments in the past.');
    }

    try {
        const newAppointment = await Appointment.create({
            doctor: doctorId,
            patient: patientId,
            date,
            reason
        });
        return newAppointment;
    } catch (error) {
        // Handle slot already taken error due to single index
        if (error.code === 11000) {
            throw new Error('This time slot is no longer available for this doctor.');
        }
        throw error;
    }
};

const findAppointmentsForDoctor = async (doctorId) => {
    const appointments = await Appointment.find({ doctor: doctorId })
        // Collect patient information to find out who made the appointment
        .populate('patient', 'firstName lastName')
        .sort({ date: 'asc' }); // Sort appointments by ascending date

    return appointments;
};

module.exports = {
    bookAppointment,
    findAppointmentsForDoctor,
};