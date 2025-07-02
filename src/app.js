const express = require('express');
const cors = require('cors');
const doctorRoutes = require('./api/routes/doctorRoutes');
const patientRoutes = require('./api/routes/patientRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
const authRoutes = require('./api/routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API',
        status: 'success'
    });
});

app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;