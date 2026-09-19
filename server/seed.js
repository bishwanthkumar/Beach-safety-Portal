import 'dotenv/config';
import mongoose from 'mongoose';
import Beach from './models/Beach.js';
import Facility from './models/Facility.js';
import Alert from './models/Alert.js';
import { beaches, makeFacilities, defaultAlerts } from './data.js';

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beachsafety';
  await mongoose.connect(uri);
  await Promise.all([Beach.deleteMany({}), Facility.deleteMany({}), Alert.deleteMany({})]);

  const created = await Beach.insertMany(beaches);
  const facilities = created.flatMap((b) => makeFacilities(b.toObject(), b._id));
  await Facility.insertMany(facilities);

  const alerts = [];
  for (const beach of created) {
    const idx = created.indexOf(beach);
    if (idx % 3 === 0) {
      alerts.push({ beachId: beach._id, ...defaultAlerts[0] });
    } else if (idx % 5 === 0) {
      alerts.push({ beachId: beach._id, ...defaultAlerts[1] });
    }
  }
  await Alert.insertMany(alerts);

  console.log(`Seeded ${created.length} beaches, ${facilities.length} facilities, ${alerts.length} alerts.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
