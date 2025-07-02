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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: error.message,
        });
    }
};


module.exports = {
    register,
    login,
};