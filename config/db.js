// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();
const dbName = process.env.DB_NAME;

const connectDB = async () => {
  try {
    await mongoose.connect(dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;