require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB } = require('../config/db');
const { seedDatabase } = require('../services/seederService');

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Seeding finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

runSeed();
