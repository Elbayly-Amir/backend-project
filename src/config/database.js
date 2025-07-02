const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const dbUrl = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL 
    : process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('Erreur: URL not definned');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl);
    
    if (process.env.NODE_ENV !== 'test') {
      console.log('Database connected successfully');
    }

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;