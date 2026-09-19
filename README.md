# BeachSafe — Interactive Tamil Nadu Beach Safety Portal

A MERN-stack beach safety portal focused on Tamil Nadu beaches. The app supports beach search, a search loading screen, beach detail pages, live weather, marine conditions, safety status, alerts, lifeguard data, nearby facilities, safety map, emergency support, Tamil/English UI toggle, family safety checklist, beach watch, and community hazard reporting.

## Stack
- Frontend: React + Vite + React Router + Leaflet/React-Leaflet + Lucide
- Backend: Node.js + Express + Mongoose
- Database: MongoDB / MongoDB Atlas
- Live data: Open-Meteo Weather API and Open-Meteo Marine API for demo-friendly live environmental data

## 1. Install

From this folder:

```bash
npm install
npm run install-all
```

Or install each folder separately:

```bash
cd server && npm install
cd ../client && npm install
```

## 2. Configure MongoDB

Copy `server/.env.example` to `server/.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/beachsafety
CLIENT_ORIGIN=http://localhost:5173
```

MongoDB Atlas also works. If MongoDB is unavailable, the API falls back to the seeded in-memory dataset so the frontend can still be demonstrated.

## 3. Seed the database

```bash
cd server
npm run seed
```

## 4. Start

Option A:

```bash
npm run dev
```

Option B:

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

Open the frontend URL shown by Vite, normally `http://localhost:5173` or the next available port.

## Core demo flow

Home → search a Tamil Nadu beach → loading animation → beach detail → live weather + humidity + temperature → marine conditions → safety status → alerts → lifeguard → nearby facilities → safety map → emergency support → report a hazard.

## Notes
- Weather and marine conditions are retrieved live from Open-Meteo through the Express backend.
- Hazard/lifeguard/facility records are seeded application data until connected to an official or authorised source.
- The safety indicator uses a transparent demo rule engine. It is intentionally presented as an information summary, not an official declaration that a beach is safe.
- For production, replace demo records with authoritative agency feeds and authorised staff updates.
