const reviewService = require('../../services/reviewService');

const addReview  = async (req, res) => {
    try {
        const reviewData = req.body;
        const newReview = await reviewService.createReview(reviewData);
        res.status(201).json({
            status: 'success',
            data: newReview
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

const getReviewsByDoctor = async (req, res) => {
    try {
        const { doctorId }= req.params;
        const reviews = await reviewService.findReviewByDoctor(doctorId);
        res.status(200).json({
            status: 'success',
            data: reviews
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    addReview,
    getReviewsByDoctor,
};