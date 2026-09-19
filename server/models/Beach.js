import mongoose from 'mongoose';

const beachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, default: 'Tamil Nadu' },
  description: String,
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  image: String,
  tags: [String],
  lifeguard: {
    status: { type: String, default: 'Unknown' },
    dutyHours: { type: String, default: 'Not available' },
    towers: { type: Number, default: 0 },
    nearestTowerMeters: { type: Number, default: null }
  },
  safety: {
    alertLevel: { type: String, default: 'green' },
    label: { type: String, default: 'No active advisory' },
    reason: { type: String, default: 'No application-level advisory is recorded.' },
    source: { type: String, default: 'Portal data' }
  }
}, { timestamps: true });

export default mongoose.model('Beach', beachSchema);
