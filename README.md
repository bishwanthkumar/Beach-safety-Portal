# BeachSafe — India Beach Safety Portal

A MERN-stack beach safety portal for beaches across India. The app supports beach search, beach detail pages, live weather, marine conditions, safety status, alerts, lifeguard data, nearby facilities, safety map, emergency support, Tamil/Hindi/Telugu/English UI, a personalized beach plan, beach watch, and community hazard reporting.

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

For local MongoDB, install MongoDB Community Server, start the MongoDB service, and keep the local URI above.

For MongoDB Atlas:

1. Create a free cluster at MongoDB Atlas.
2. Create a database user and allow your development IP in Network Access.
3. Replace `MONGODB_URI` with the Atlas connection string, for example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

Do not commit `server/.env` or place credentials in source code. The repository ignores environment files.

Check the connection after starting the API:

```bash
curl http://localhost:5000/api/health
```

MongoDB connected responses include `"mongoReady":true` and `"database":"MongoDB"`. If MongoDB is unavailable, the API explicitly reports `"database":"fallback demo data"` and the frontend remains usable.

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

Home → search an Indian beach → beach alert notification → beach detail → live weather + humidity + temperature → marine conditions → personalized beach plan → alerts → lifeguard → nearby facilities → safety map → emergency support → report a hazard.

## Notes
- Weather and marine conditions are retrieved live from Open-Meteo through the Express backend.
- Hazard/lifeguard/facility records are seeded application data until connected to an official or authorised source.
- The safety indicator uses a transparent demo rule engine. It is intentionally presented as an information summary, not an official declaration that a beach is safe.
- For production, replace demo records with authoritative agency feeds and authorised staff updates.
