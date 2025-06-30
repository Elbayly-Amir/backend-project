const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const doctorRoutes = require('./api/routes/doctorRoutes');

connectDB();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;