import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  beachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beach', required: true },
  title: { type: String, required: true },
  severity: { type: String, enum: ['info', 'caution', 'high', 'emergency'], default: 'info' },
  description: String,
  source: { type: String, default: 'Portal demo data' },
  issuedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
