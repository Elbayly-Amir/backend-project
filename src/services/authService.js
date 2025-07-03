const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Doctor = require('../models/Doctor');

// We generate a jwt token for the user
const generrateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register a new user
const registerUser = async (userData) => {
    const { email, password, role, firstName, lastName, specialty } = userData;    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        email,
        password,
        role,
    });

    if (user && role === 'doctor') {
        await Doctor.create({
            _id: user._id,
            firstName,
            lastName,
            specialty,
            email: user.email
        });
    }
    if (user && role === 'patient') {
       if (!firstName && !lastName) {
            throw new Error('First name and last name are required for patient registration');
        }
        await Patient.create({
            _id: user._id,
            user: user._id,
            firstName,
            lastName,
        });
    }

    if (user) {
        const token = generrateToken(user._id);
        return {
            _id: user._id,
            email: user.email,
            role: user.role,
            token :token,
        };
    } else {
        throw new Error('Invalid user data');
    }
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {

        return {
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generrateToken(user._id),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

module.exports = {
    registerUser,
    loginUser,
};