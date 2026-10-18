# Fieldwise Smart Crop — Cloud-Based Crop Recommendation Prototype

**Course:** CSI3001 — Cloud Computing Methodologies  
**Institution:** VIT Vellore

Fieldwise is a React + Express academic prototype for comparing crop suitability against user-entered soil texture, season, pH, temperature, and rainfall. It also contains optional location, soil, weather, media, PDF, and Firebase integrations.

## Important implementation note

The current crop ranking is a **deterministic, rules-based suitability heuristic**, not a trained machine-learning model. Crop profiles, suitability ranges, fertilizer plans, expected yields, durations, and cultivation schedules are static reference data in `server/src/crops.js`. Suitability scores are compatibility scores, not calibrated probabilities. The agricultural content is educational and should be verified with local extension services and a soil test before field use.

External services use fallback behavior in some cases. A successful HTTP response does not always mean an upstream service returned live data; check `source`, `simulated`, and `confidence` fields in responses. Seasonal rainfall remains a manual input in the current UI.

## Requirements

- Node.js 20 or newer
- npm
- Internet access for dependency installation and live third-party APIs
- Optional credentials for OpenWeatherMap, Unsplash/Pexels, YouTube Data API, and Firebase

## Run locally

Create environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Configure only the keys you actually use. Never commit or share `.env` files.

Terminal 1 — API:

```bash
cd server
npm ci
npm test
npm run dev
```

API base URL: `http://localhost:4000`

Terminal 2 — React client:

```bash
cd client
npm ci
npm run dev
```

Vite normally serves the client at `http://localhost:5173`.

## Main API routes

- `GET /api/health` — API status and configured optional credentials; it does not probe all third-party providers.
- `POST /api/predict` — validates the field input and returns the top four rule-based crop profiles.
- `GET /api/geocode?city=Vellore` — OpenStreetMap Nominatim lookup.
- `GET /api/soil?lat=12.9165&lon=79.1325` — SoilGrids lookup with a clearly labelled regional fallback.
- `GET /api/weather?city=Vellore` — OpenWeatherMap, then alternate weather source, then a labelled baseline fallback.
- `GET /api/location-intelligence?city=Vellore` — combines geocoding, soil and weather responses.
- `GET /api/media/image?crop=Rice` and `/api/media/video?crop=Rice` — optional media lookup with curated fallback content.

## Firebase and demo history

Google sign-in requires a configured Firebase project and authorized web origin. Demo/custom profiles are **not authentication** and only save local browser history. A local demo profile must not be used to access or write private Firebase data. Firebase rules are in `firestore.rules`; test them in a configured Firebase project before relying on cloud persistence.

## Netlify

`netlify.toml` configures a client build and an Express serverless function wrapper. A real deployment still requires configuring environment variables in Netlify and testing routes against the deployed domain.

## Audit report

See [`AUDIT_AND_VALIDATION_REPORT.md`](./AUDIT_AND_VALIDATION_REPORT.md) for code-review findings, local test results, integration limitations, and recommended fixes.
