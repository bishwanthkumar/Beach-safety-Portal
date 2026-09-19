import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  beachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  distanceMeters: { type: Number, default: 0 },
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

export default mongoose.model('Facility', facilitySchema);
