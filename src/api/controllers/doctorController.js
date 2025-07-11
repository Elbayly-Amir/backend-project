const doctorService = require('../../services/doctorService');

const createDoctor = async (req, res) => {
    try {
        const doctorData = req.body;
        const newDoctor = await doctorService.createDoctorProfile(doctorData);
        res.status(201).json({
            status: 'success',
            data: newDoctor
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

const getAllDoctors = async (req, res) => {
  try {
        const doctors = await doctorService.findAllDoctors(req.query);
        
        res.status(200).json({
            status: 'success',
            data: doctors
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

const getDoctorProfile = async (req, res) => {
    try{
      const doctor = await doctorService.getDoctorProfile(req.params.id);
      res.status(200).json(doctor);
    } catch (error) {
           if (error.message === 'Doctor not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;

        if (!req.user._id.equals(doctorId)) {
            return res.status(403).json({ message: 'You can only update your own profile' });
        }

        const updateData = req.body;
        const updatedDoctor = await doctorService.updateDoctorProfile(doctorId, updateData);
        res.status(200).json({
            status: 'success',
            data: updatedDoctor
        });
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;

        if (!req.user._id.equals(doctorId)) {
            return res.status(403).json({ message: 'You can only delete your own profile' });
        }
        
        await doctorService.deleteDoctorProfile(doctorId);
        res.status(204).send();

    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorProfile,
    updateDoctor,
    deleteDoctor,
};