import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  beachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  reporter: { type: String, default: 'Anonymous visitor' },
  coordinates: { lat: Number, lng: Number },
  status: { type: String, enum: ['new', 'reviewing', 'resolved'], default: 'new' }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
