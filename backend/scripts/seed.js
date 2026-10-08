const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { connectDB } = require('../config/db');
const { initStore } = require('../services/dataService');

const runSeed = async () => {
  console.log('[Seed Script] Initializing WeCare Hospital database...');
  await connectDB();
  await initStore();
  console.log('[Seed Script] Seeding complete!');
  process.exit(0);
};

runSeed();
