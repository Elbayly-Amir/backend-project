const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [12, 'Password must be at least 12 characters long']
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        default: 'patient'
    },
    }, {
        timestamps: true,
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();   
   
}

const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;