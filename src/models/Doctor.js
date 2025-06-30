const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [20, 'First name must not exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [20, 'Last name must not exceed 50 characters']
    },
    specialty: {
        type: String,
        required: [true, 'Specialty is required'],
        trim: true,
    },
    
}, {
    timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;