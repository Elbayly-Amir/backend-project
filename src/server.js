const app = require('./app'); // On importe l'application
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    // On garde ce console.log uniquement pour le développement
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Server is running on port ${PORT}`);
    }
});