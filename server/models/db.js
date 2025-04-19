const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/nwp-projectDB');
    console.log('MongoDB uspješno spojen');
  } catch (err) {
    console.error('Greška pri spajanju:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 
