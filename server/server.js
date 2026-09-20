import 'dotenv/config';

import dns from 'node:dns';

// Force Node DNS to use public resolvers.
// Useful for MongoDB SRV connection lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import Beach from './models/Beach.js';
import Facility from './models/Facility.js';
import Alert from './models/Alert.js';
import Report from './models/Report.js';

import {
  beaches as fallbackBeaches,
  makeFacilities
} from './data.js';

import {
  getWeather,
  weatherLabel
} from './services/weather.js';

import {
  getMarine
} from './services/marine.js';

import {
  computeSafetyStatus
} from './services/safety.js';


/* =========================================================
   APP CONFIGURATION
========================================================= */

const app = express();

const PORT = Number(
  process.env.PORT || 5000
);

const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  'http://localhost:5173,https://beachsafe-portal.vercel.app';

const MONGODB_URI =
  process.env.MONGODB_URI?.trim() || '';


/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  ...new Set([
    ...CLIENT_ORIGIN
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),

    'https://beachsafe-portal.vercel.app'
  ])
];


function isAllowedOrigin(origin) {
  // Requests such as direct browser navigation
  // may not contain an Origin header.
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);

    return (
      ['localhost', '127.0.0.1'].includes(
        url.hostname
      ) &&
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
}


app.use(
  cors({
    origin: (origin, callback) => {
      callback(
        null,
        isAllowedOrigin(origin)
      );
    },

    credentials: false
  })
);


app.use(
  express.json({
    limit: '2mb'
  })
);


/* =========================================================
   MONGODB CONNECTION
========================================================= */

let mongoReady = false;

let mongoPromise = null;

let mongoError = null;


/**
 * Connect to MongoDB Atlas.
 *
 * This function:
 * - reuses an existing connection
 * - avoids creating multiple simultaneous connections
 * - stores a safe diagnostic error
 * - retries after a failed connection
 */
async function connectMongo() {

  /* ---------------------------------------------
     No URI configured
  --------------------------------------------- */

  if (!MONGODB_URI) {
    mongoReady = false;

    mongoError = {
      name: 'ConfigurationError',
      message:
        'MONGODB_URI is not configured.'
    };

    return false;
  }


  /* ---------------------------------------------
     Already connected
  --------------------------------------------- */

  if (
    mongoose.connection.readyState === 1
  ) {
    mongoReady = true;
    mongoError = null;

    return true;
  }


  /* ---------------------------------------------
     Connection already in progress
  --------------------------------------------- */

  if (mongoPromise) {
    return mongoPromise;
  }


  console.log(
    'Attempting MongoDB connection...'
  );


  /* ---------------------------------------------
     Start connection
  --------------------------------------------- */

  mongoPromise = mongoose
    .connect(MONGODB_URI, {

      // Give Vercel enough time to establish
      // the Atlas connection.
      serverSelectionTimeoutMS: 15000,

      connectTimeoutMS: 15000,

      socketTimeoutMS: 45000,

      maxPoolSize: 10,

      minPoolSize: 0,

      // Use IPv4 to avoid certain network issues.
      family: 4
    })

    .then(() => {

      mongoReady = true;

      mongoError = null;

      console.log(
        'MongoDB connected successfully'
      );

      return true;
    })

    .catch((err) => {

      mongoReady = false;

      mongoPromise = null;

      mongoError = {
        name:
          err?.name ||
          'MongoError',

        message:
          err?.message ||
          'Unknown MongoDB connection error'
      };


      console.error(
        'MONGODB_CONNECTION_ERROR:',
        err?.message || err
      );


      return false;
    });


  return mongoPromise;
}


/* =========================================================
   MONGODB EVENTS
========================================================= */

mongoose.connection.on(
  'connected',
  () => {

    mongoReady = true;

    mongoError = null;

    console.log(
      'MongoDB event: connected'
    );
  }
);


mongoose.connection.on(
  'disconnected',
  () => {

    mongoReady = false;

    console.warn(
      'MongoDB event: disconnected'
    );
  }
);


mongoose.connection.on(
  'error',
  (err) => {

    mongoReady = false;

    mongoError = {
      name:
        err?.name ||
        'MongoError',

      message:
        err?.message ||
        'MongoDB connection event error'
    };


    console.error(
      'MongoDB connection event error:',
      err?.message || err
    );
  }
);


/* =========================================================
   FALLBACK BEACH HELPERS
========================================================= */

function toPlainFallbackBeach(
  raw,
  index = 0
) {

  return {
    ...raw,

    state:
      raw.state ||
      'Tamil Nadu',

    _id:
      raw._id ||
      `fallback-${index}`,

    id:
      raw._id ||
      `fallback-${index}`
  };
}


/* =========================================================
   FIND BEACH
========================================================= */

async function findBeach(id) {

  if (mongoReady) {

    return Beach
      .findById(id)
      .lean();
  }


  const idx = Number(
    String(id)
      .replace('fallback-', '')
  );


  if (
    Number.isInteger(idx) &&
    fallbackBeaches[idx]
  ) {

    return toPlainFallbackBeach(
      fallbackBeaches[idx],
      idx
    );
  }


  return null;
}


/* =========================================================
   BEACH ALERTS
========================================================= */

async function getBeachAlerts(
  beachId,
  fallbackIndex = null
) {

  /* ---------------------------------------------
     MongoDB mode
  --------------------------------------------- */

  if (mongoReady) {

    return Alert
      .find({
        beachId,
        active: true
      })
      .sort({
        issuedAt: -1
      })
      .lean();
  }


  /* ---------------------------------------------
     Fallback demo mode
  --------------------------------------------- */

  const result = [];


  if (
    fallbackIndex !== null &&
    fallbackIndex % 3 === 0
  ) {

    result.push({

      _id:
        `a-${fallbackIndex}`,

      beachId,

      title:
        'Strong wind advisory',

      severity:
        'caution',

      description:
        'Exercise care near open shore areas and follow local beach instructions.',

      source:
        'BeachSafe demo data',

      issuedAt:
        new Date().toISOString(),

      active:
        true
    });
  }


  if (
    fallbackIndex !== null &&
    fallbackIndex % 5 === 0
  ) {

    result.push({

      _id:
        `b-${fallbackIndex}`,

      beachId,

      title:
        'High wave information',

      severity:
        'high',

      description:
        'Water entry should follow current local authority and lifeguard guidance.',

      source:
        'BeachSafe demo data',

      issuedAt:
        new Date().toISOString(),

      active:
        true
    });
  }


  return result;
}


/* =========================================================
   ROOT
========================================================= */

app.get(
  '/',
  async (req, res) => {

    res.json({

      service:
        'BeachSafe API',

      version:
        '1.0.0',

      status:
        'running',

      endpoints: {

        health:
          '/api/health',

        beaches:
          '/api/beaches',

        beachDetails:
          '/api/beaches/:id',

        fullBeachData:
          '/api/beaches/:id/full',

        facilities:
          '/api/beaches/:id/facilities',

        reports:
          '/api/reports'
      },

      frontend:
        CLIENT_ORIGIN,

      message:
        'BeachSafe API is running.'
    });
  }
);


/* =========================================================
   API ROOT
========================================================= */

app.get(
  '/api',
  (req, res) => {

    res.json({

      success:
        true,

      service:
        'BeachSafe API',

      message:
        'API is running. Use /api/health to check service status.'
    });
  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  '/api/health',
  async (req, res) => {

    // Important:
    // Explicitly attempt MongoDB connection
    // before reporting the health state.
    await connectMongo();


    res.json({

      success:
        true,

      service:
        'BeachSafe API',

      mongoReady,

      database:
        mongoReady
          ? 'MongoDB'
          : 'fallback demo data',

      mongoConfigured:
        Boolean(MONGODB_URI),

      // Diagnostic information.
      // This never contains your password.
      mongoError
    });
  }
);


/* =========================================================
   GET ALL / SEARCH BEACHES
========================================================= */

app.get(
  '/api/beaches',
  async (req, res) => {

    try {

      await connectMongo();


      const q = String(
        req.query.q || ''
      ).trim();


      const regex = q
        ? new RegExp(q, 'i')
        : null;


      const limit =
        Math.min(
          Math.max(
            Number(
              req.query.limit || 30
            ),
            1
          ),
          100
        );


      let list;


      /* ---------------------------------------------
         MONGODB MODE
      --------------------------------------------- */

      if (mongoReady) {

        const filter = q
          ? {
              $or: [

                {
                  name: regex
                },

                {
                  district: regex
                },

                {
                  state: regex
                },

                {
                  tags: regex
                }
              ]
            }
          : {};


        list =
          await Beach
            .find(filter)
            .sort({
              name: 1
            })
            .limit(limit)
            .lean();
      }


      /* ---------------------------------------------
         FALLBACK MODE
      --------------------------------------------- */

      else {

        list =
          fallbackBeaches

            .filter((b) => {

              if (!regex) {
                return true;
              }


              return (

                regex.test(b.name) ||

                regex.test(
                  b.district
                ) ||

                regex.test(
                  b.state
                ) ||

                b.tags?.some(
                  (tag) =>
                    regex.test(tag)
                )
              );
            })


            .slice(0, limit)


            .map((b) =>
              toPlainFallbackBeach(
                b,
                fallbackBeaches.indexOf(
                  b
                )
              )
            );


        list =
          await Promise.all(
            list.map(
              async (beach) => {

                const fallbackIndex =
                  Number(
                    String(
                      beach._id
                    ).replace(
                      'fallback-',
                      ''
                    )
                  );


                const alerts =
                  await getBeachAlerts(
                    beach._id,
                    fallbackIndex
                  );


                const alertLevel =
                  alerts.some(
                    (alert) =>
                      [
                        'high',
                        'emergency'
                      ].includes(
                        alert.severity
                      )
                  )
                    ? 'high'
                    : alerts.some(
                        (alert) =>
                          alert.severity ===
                          'caution'
                      )
                    ? 'yellow'
                    : beach
                        .safety
                        ?.alertLevel ||
                      'green';


                return {

                  ...beach,

                  safety: {

                    ...beach.safety,

                    alertLevel
                  }
                };
              }
            )
          );
      }


      res.json({

        success:
          true,

        data:
          list,

        source:
          mongoReady
            ? 'MongoDB'
            : 'fallback'
      });

    } catch (err) {

      console.error(
        'Beach search error:',
        err
      );


      res.status(500).json({

        success:
          false,

        message:
          err?.message ||
          'Failed to fetch beaches'
      });
    }
  }
);


/* =========================================================
   GET SINGLE BEACH
========================================================= */

app.get(
  '/api/beaches/:id',
  async (req, res) => {

    try {

      await connectMongo();


      const beach =
        await findBeach(
          req.params.id
        );


      if (!beach) {

        return res.status(404).json({

          success:
            false,

          message:
            'Beach not found'
        });
      }


      const fallbackIndex =
        String(
          beach._id
        ).startsWith(
          'fallback-'
        )
          ? Number(
              String(
                beach._id
              ).replace(
                'fallback-',
                ''
              )
            )
          : null;


      const alerts =
        await getBeachAlerts(
          beach._id,
          fallbackIndex
        );


      res.json({

        success:
          true,

        data: {

          beach,

          alerts
        }
      });

    } catch (err) {

      console.error(
        'Beach details error:',
        err
      );


      res.status(500).json({

        success:
          false,

        message:
          err.message
      });
    }
  }
);


/* =========================================================
   FULL BEACH DATA
   WEATHER + MARINE + SAFETY + ALERTS + FACILITIES
========================================================= */

app.get(
  '/api/beaches/:id/full',
  async (req, res) => {

    try {

      await connectMongo();


      const beach =
        await findBeach(
          req.params.id
        );


      if (!beach) {

        return res.status(404).json({

          success:
            false,

          message:
            'Beach not found'
        });
      }


      const fallbackIndex =
        String(
          beach._id
        ).startsWith(
          'fallback-'
        )
          ? Number(
              String(
                beach._id
              ).replace(
                'fallback-',
                ''
              )
            )
          : null;


      /* ---------------------------------------------
         Weather + Marine + Alerts
      --------------------------------------------- */

      const [
        weatherResult,
        marineResult,
        alertsResult
      ] =
        await Promise.allSettled([

          getWeather(
            beach.coordinates.lat,
            beach.coordinates.lng
          ),

          getMarine(
            beach.coordinates.lat,
            beach.coordinates.lng
          ),

          getBeachAlerts(
            beach._id,
            fallbackIndex
          )
        ]);


      /* ---------------------------------------------
         Weather
      --------------------------------------------- */

      const weather =
        weatherResult.status ===
        'fulfilled'
          ? weatherResult.value
          : null;


      /* ---------------------------------------------
         Marine
      --------------------------------------------- */

      const marine =
        marineResult.status ===
        'fulfilled'
          ? marineResult.value
          : null;


      /* ---------------------------------------------
         Alerts
      --------------------------------------------- */

      const alertData =
        alertsResult.status ===
        'fulfilled'
          ? alertsResult.value
          : [];


      /* ---------------------------------------------
         Safety calculation
      --------------------------------------------- */

      const safetyStatus =
        computeSafetyStatus({

          beach,

          marine,

          alerts:
            alertData
        });


      /* ---------------------------------------------
         Facilities
      --------------------------------------------- */

      let facilities;


      if (mongoReady) {

        facilities =
          await Facility
            .find({
              beachId:
                beach._id
            })
            .sort({
              distanceMeters: 1
            })
            .lean();

      } else {

        facilities =
          makeFacilities(
            beach,
            beach._id
          );
      }


      /* ---------------------------------------------
         Final response
      --------------------------------------------- */

      res.json({

        success:
          true,

        data: {

          beach,


          weather:
            weather
              ? {

                  ...weather,

                  description:
                    weatherLabel(
                      weather.weatherCode
                    )
                }
              : {

                  error:
                    'Live weather temporarily unavailable.'
                },


          marine:
            marine || {

              error:
                'Live marine data temporarily unavailable.'
            },


          safetyStatus,


          alerts:
            alertData,


          facilities,


          lastUpdated:
            new Date().toISOString(),


          dataSource:
            mongoReady
              ? 'MongoDB + live services'
              : 'Fallback beach data + live services'
        }
      });

    } catch (err) {

      console.error(
        'Full beach data error:',
        err
      );


      res.status(500).json({

        success:
          false,

        message:
          err?.message ||
          'Failed to load beach information'
      });
    }
  }
);


/* =========================================================
   FACILITIES
========================================================= */

app.get(
  '/api/beaches/:id/facilities',
  async (req, res) => {

    try {

      await connectMongo();


      const beach =
        await findBeach(
          req.params.id
        );


      if (!beach) {

        return res.status(404).json({

          success:
            false,

          message:
            'Beach not found'
        });
      }


      const facilities =
        mongoReady

          ? await Facility
              .find({
                beachId:
                  beach._id
              })
              .sort({
                distanceMeters:
                  1
              })
              .lean()

          : makeFacilities(
              beach,
              beach._id
            );


      res.json({

        success:
          true,

        data:
          facilities
      });

    } catch (err) {

      console.error(
        'Facilities error:',
        err
      );


      res.status(500).json({

        success:
          false,

        message:
          err.message
      });
    }
  }
);


/* =========================================================
   REPORT A HAZARD
========================================================= */

app.post(
  '/api/reports',
  async (req, res) => {

    try {

      await connectMongo();


      const {
        beachId,
        category,
        description,
        reporter,
        coordinates
      } = req.body;


      if (
        !beachId ||
        !category ||
        !description
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            'beachId, category and description are required.'
        });
      }


      /* ---------------------------------------------
         MongoDB mode
      --------------------------------------------- */

      if (mongoReady) {

        const report =
          await Report.create({

            beachId,

            category,

            description,

            reporter,

            coordinates
          });


        return res.status(201).json({

          success:
            true,

          data:
            report
        });
      }


      /* ---------------------------------------------
         Fallback mode
      --------------------------------------------- */

      return res.status(201).json({

        success:
          true,

        data: {

          _id:
            `local-${Date.now()}`,

          beachId,

          category,

          description,

          reporter:
            reporter ||
            'Anonymous visitor',

          coordinates,

          status:
            'new',

          createdAt:
            new Date().toISOString()
        },

        demoMode:
          true
      });

    } catch (err) {

      console.error(
        'Report error:',
        err
      );


      res.status(500).json({

        success:
          false,

        message:
          err.message
      });
    }
  }
);


/* =========================================================
   SERVER START
========================================================= */

app.listen(
  PORT,
  async () => {

    console.log(
      `BeachSafe API running at http://localhost:${PORT}`
    );


    if (MONGODB_URI) {

      await connectMongo();

    } else {

      console.warn(
        'MONGODB_URI is not configured.'
      );
    }
  }
);


/* =========================================================
   EXPORT APP
========================================================= */

export default app;