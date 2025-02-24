// config/db.js
const mongoose = require('mongoose');
const config = require('./config');
const dbName = config.database.url;

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