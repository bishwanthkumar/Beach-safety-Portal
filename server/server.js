import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Beach from './models/Beach.js';
import Facility from './models/Facility.js';
import Alert from './models/Alert.js';
import Report from './models/Report.js';
import { beaches as fallbackBeaches, makeFacilities } from './data.js';
import { getWeather, weatherLabel } from './services/weather.js';
import { getMarine } from './services/marine.js';
import { computeSafetyStatus } from './services/safety.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const allowedOrigins = CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const url = new URL(origin);
    return ['localhost', '127.0.0.1'].includes(url.hostname) && url.protocol === 'http:';
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
  credentials: false
}));
app.use(express.json({ limit: '2mb' }));

let mongoReady = false;
async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beachsafety', {
      serverSelectionTimeoutMS: 2500
    });
    mongoReady = true;
    console.log('MongoDB connected');
  } catch (err) {
    mongoReady = false;
    console.warn('MongoDB unavailable — using fallback seeded data for demo mode.');
  }
}

function toPlainFallbackBeach(raw, index = 0) {
  return {
    ...raw,
    _id: raw._id || `fallback-${index}`,
    id: raw._id || `fallback-${index}`
  };
}

async function findBeach(id) {
  if (mongoReady) return Beach.findById(id).lean();
  const idx = Number(String(id).replace('fallback-', ''));
  return Number.isInteger(idx) && fallbackBeaches[idx] ? toPlainFallbackBeach(fallbackBeaches[idx], idx) : null;
}

async function getBeachAlerts(beachId, fallbackIndex = null) {
  if (mongoReady) return Alert.find({ beachId, active: true }).sort({ issuedAt: -1 }).lean();
  const result = [];
  if (fallbackIndex !== null && fallbackIndex % 3 === 0) {
    result.push({ _id: `a-${fallbackIndex}`, beachId, title: 'Strong wind advisory', severity: 'caution', description: 'Exercise care near open shore areas and follow local beach instructions.', source: 'BeachSafe demo data', issuedAt: new Date().toISOString(), active: true });
  }
  if (fallbackIndex !== null && fallbackIndex % 5 === 0) {
    result.push({ _id: `b-${fallbackIndex}`, beachId, title: 'High wave information', severity: 'high', description: 'Water entry should follow current local authority and lifeguard guidance.', source: 'BeachSafe demo data', issuedAt: new Date().toISOString(), active: true });
  }
  return result;
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'BeachSafe API', mongoReady });
});

app.get('/', (req, res) => {
  res.json({
    service: 'BeachSafe API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      beaches: '/api/beaches',
      beachDetails: '/api/beaches/:id',
      fullBeachData: '/api/beaches/:id/full',
      facilities: '/api/beaches/:id/facilities',
      reports: '/api/reports'
    },
    frontend: CLIENT_ORIGIN,
    message: 'BeachSafe API is running. Access the frontend at ' + CLIENT_ORIGIN
  });
});

app.get('/api/beaches', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    const regex = q ? new RegExp(q, 'i') : null;
    const limit = Math.min(Math.max(Number(req.query.limit || 30), 1), 100);
    let list;
    if (mongoReady) {
      const filter = q ? { $or: [{ name: regex }, { district: regex }, { state: regex }, { tags: regex }] } : {};
      list = await Beach.find(filter).sort({ name: 1 }).limit(limit).lean();
    } else {
      list = fallbackBeaches.filter((b) => !regex || regex.test(b.name) || regex.test(b.district) || regex.test(b.state) || b.tags?.some((t) => regex.test(t))).slice(0, limit).map((b, i) => toPlainFallbackBeach(b, fallbackBeaches.indexOf(b)));
    }
    res.json({ success: true, data: list, source: mongoReady ? 'MongoDB' : 'fallback' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/beaches/:id', async (req, res) => {
  try {
    const beach = await findBeach(req.params.id);
    if (!beach) return res.status(404).json({ success: false, message: 'Beach not found' });
    const fallbackIndex = String(beach._id).startsWith('fallback-') ? Number(String(beach._id).replace('fallback-', '')) : null;
    const alerts = await getBeachAlerts(beach._id, fallbackIndex);
    res.json({ success: true, data: { beach, alerts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/beaches/:id/full', async (req, res) => {
  try {
    const beach = await findBeach(req.params.id);
    if (!beach) return res.status(404).json({ success: false, message: 'Beach not found' });
    const fallbackIndex = String(beach._id).startsWith('fallback-') ? Number(String(beach._id).replace('fallback-', '')) : null;

    const [weatherResult, marineResult, alerts] = await Promise.allSettled([
      getWeather(beach.coordinates.lat, beach.coordinates.lng),
      getMarine(beach.coordinates.lat, beach.coordinates.lng),
      getBeachAlerts(beach._id, fallbackIndex)
    ]);

    const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
    const marine = marineResult.status === 'fulfilled' ? marineResult.value : null;
    const alertData = alerts.status === 'fulfilled' ? alerts.value : [];
    const safetyStatus = computeSafetyStatus({ beach, marine, alerts: alertData });

    let facilities;
    if (mongoReady) {
      facilities = await Facility.find({ beachId: beach._id }).sort({ distanceMeters: 1 }).lean();
    } else {
      facilities = makeFacilities(beach, beach._id);
    }

    res.json({
      success: true,
      data: {
        beach,
        weather: weather ? { ...weather, description: weatherLabel(weather.weatherCode) } : { error: 'Live weather temporarily unavailable.' },
        marine: marine || { error: 'Live marine data temporarily unavailable.' },
        safetyStatus,
        alerts: alertData,
        facilities,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/beaches/:id/facilities', async (req, res) => {
  try {
    const beach = await findBeach(req.params.id);
    if (!beach) return res.status(404).json({ success: false, message: 'Beach not found' });
    const facilities = mongoReady ? await Facility.find({ beachId: beach._id }).sort({ distanceMeters: 1 }).lean() : makeFacilities(beach, beach._id);
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { beachId, category, description, reporter, coordinates } = req.body;
    if (!beachId || !category || !description) return res.status(400).json({ success: false, message: 'beachId, category and description are required.' });
    if (mongoReady) {
      const report = await Report.create({ beachId, category, description, reporter, coordinates });
      return res.status(201).json({ success: true, data: report });
    }
    return res.status(201).json({ success: true, data: { _id: `local-${Date.now()}`, beachId, category, description, reporter: reporter || 'Anonymous visitor', coordinates, status: 'new', createdAt: new Date().toISOString() }, demoMode: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`BeachSafe API running at http://localhost:${PORT}`);
  await connectMongo();
});
