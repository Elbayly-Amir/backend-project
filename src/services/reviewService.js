const Review = require('../models/Review');

const createReview = async (reviewData) => {
    try {
        const review = new Review(reviewData);
        await review.save();
        return review;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findReviewByDoctor = async (doctorId) => {
    try {
        const reviews = await Review.find({ doctor: doctorId }).populate('patient', 'name email');
        return reviews;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createReview,
    findReviewByDoctor,
};