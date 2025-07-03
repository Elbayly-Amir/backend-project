const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Review = require('../models/Review');

const createDoctorProfile  = async (doctorData) => {
    try {
        const doctor = new Doctor(doctorData);
        await doctor.save();
        return doctor;
    } catch (error) {
        throw new Error(error.message);
    }
};

// We had to modify the findAllDoctors function to accept filters for specialty and city
const findAllDoctors = async (filters = {}) => {
    const query = {};

    if (filters.specialty) {
        query.specialty = { $regex: filters.specialty, $options: 'i' };
    }

    if (filters.city) {
        query['location.city'] = { $regex: filters.city, $options: 'i' };
    }

    try {
        const doctors = await Doctor.find(query);
        return doctors;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getDoctorProfile = async (doctorId) => {

   const doctor = await Doctor.findById(doctorId)
    .populate('doctorsConnection', 'firstName lastName specialty');

  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const reviews = await Review.find({ doctor: doctorId })
    .populate('patient', 'firstName lastName');

  const patientIds = [...new Set(reviews.map(review => review.patient._id))];
  const patients = await Patient.find({ '_id': { $in: patientIds } });
  const fullProfile = doctor.toObject(); 
  fullProfile.patients = patients;
  fullProfile.reviews = reviews;

  return fullProfile;
};

const updateDoctorProfile = async (doctorId, updateData) => {
        const doctor = await Doctor.findByIdAndUpdate(doctorId, updateData, { 
            new: true,
            runValidators: true,
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
};

const deleteDoctorProfile = async (doctorId) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createDoctorProfile,
    findAllDoctors,
    getDoctorProfile,
    updateDoctorProfile,
    deleteDoctorProfile,
};