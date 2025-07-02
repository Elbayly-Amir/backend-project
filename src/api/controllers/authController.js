const authService = require('../../services/authService');

const register = async (req, res) => {
    try { 
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            status: 'success',
            data: user,
    });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

module.exports = {
    register,
};