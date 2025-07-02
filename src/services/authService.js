const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// We generate a jwt token for the user
const generrateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register a new user
const registerUser = async (userData) => {
    const { email, password, role } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        email,
        password,
        role,
    });

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

module.exports = {
    generrateToken,
    registerUser,
};