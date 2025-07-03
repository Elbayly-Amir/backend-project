const jwt = require('jsonwebtoken');
const User = require('../models/User');
require ('dotenv').config();

const protect = async (req, res, next) => {
    let token;

    // Check if the token is in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password from user data
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
        }

    if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });

    }
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = {
    protect,
    authorize,
};
    


