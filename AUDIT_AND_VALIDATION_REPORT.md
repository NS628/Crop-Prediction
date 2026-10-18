# Fieldwise Smart Crop — Code Audit & Validation Report

**Audit date:** 12 October 2026  
**Scope:** Source ZIP and submitted Cloud Computing Methodologies report. This is a static code review plus local API checks; it is not a claim of production deployment verification.

## Executive verdict

The project is a real React + Express application with a working rules-based recommendation API. It is **not** a trained machine-learning crop-prediction model. The crop ranking, fertilizer quantities, crop schedules, yield ranges, and fallback values are largely static, hand-authored profiles. Several external integrations are implemented in code but were not live in this validation environment. Firebase cloud persistence cannot be considered verified without a configured Firebase project and a real Google-authenticated user.

**Overall:** Good prototype foundation and UI, but the original submission dossier overstated the verification status. Do not describe all integrations as fully verified until configured credentials, live provider responses, Firestore access, and a deployed build are tested.

## Feature status matrix

| Feature | What the code actually does | Validation status |
|---|---|---|
| React dashboard | React/Vite SPA with input form, recommendations, crop detail tabs, history drawer, weather section and PDF action | Source present; archived production bundle exists. Fresh build initially failed because archived `node_modules` lacked the platform-specific Rolldown native binding. |
| Recommendation API | `POST /api/predict` validates soil/season/numeric ranges, calls `recommendCrops()` in `server/src/crops.js`, and returns four ranked profiles | **Verified locally**: HTTP 200 for valid input; HTTP 400 for invalid soil. |
| Recommendation algorithm | Arithmetic mean of five manually weighted suitability factors: soil, season, pH, temperature and rainfall. Soil/season mismatch receives 0.35; range factors use a linear distance score | **Working rules engine, not ML**. Crop profiles and their ranges are hardcoded. Equal weighting and overlapping ranges can produce ties (Rice and Sugarcane both scored 100 for the sample input). |
| Fertilizer plans | Static Urea/DAP/MOP totals, split stages and advice stored in crop profiles | Data renders from the API response, but values are **hardcoded references**, not calculated from a soil test or farm size. Must be validated with local agronomy guidance before real-world use. |
| Cultivation schedules / yield / duration | Static text and ranges per crop profile | Hardcoded reference content; not dynamically computed. |
| Location geocoding | Nominatim request is implemented in `/api/geocode` and `/api/location-intelligence` | **Not live in this run**: network request failed in this environment. |
| SoilGrids | Fetch/parser implemented with a fallback estimate | Endpoint returned fallback values during this run. Must label them as estimates; they are not field-measured soil results. |
| Weather | OpenWeatherMap if configured, then wttr.in, then fixed baseline | Health check reported OpenWeatherMap key absent; endpoint returned 28°C/68% baseline with `simulated: true`. Thus live weather was **not verified**. |
| Crop images | Unsplash/Pexels lookup if keys exist, otherwise fixed CDN URLs | Returned a curated fallback image; dynamic media APIs not configured. |
| Educational videos | YouTube search if configured, otherwise fixed YouTube IDs | Returned a fixed fallback video; YouTube Data API not configured. A fixed video ID may be stale or not crop-specific. |
| PDF report | jsPDF client-side generator | Source exists; generation was not browser-tested in this environment. |
| Firebase Google sign-in | Firebase client configuration is conditional; Google OAuth is implemented | **Not verified** because no configured Firebase service was reported. |
| History persistence | Firestore path exists, but original UI also creates local/demo identities and localStorage records | Original behavior could misrepresent local demo storage as cloud history. Source updated to label demo storage accurately, persist complete recommendations to Firestore, and delete remote records when a real Firebase user is signed in. Live Firestore still needs credentials and a browser test. |
| Firebase Admin SDK | Optional initialization module | Not configured; no backend Firestore/Admin operation is implemented as an API route. The current history path uses the client SDK directly. |
| Netlify deployment | `netlify.toml` and serverless Express wrapper exist | Configuration present; actual deploy/build was not verified. |
| Automated tests | Six recommendation subtests plus three new route-level tests | **10/10 passed**. Tests cover the rules engine and basic health/prediction routes; they do not cover auth, Firestore, Netlify routing, browser behavior, security, or live API failures. |

## Live checks performed

- `GET /api/health`: HTTP 200. Reported OpenWeatherMap, Unsplash/Pexels, YouTube and Firebase Admin as not configured; SoilGrids and Nominatim were marked available by implementation, not by a live health probe.
- `POST /api/predict` with `loam / monsoon / 28°C / pH 6.5 / 180 cm`: HTTP 200, four recommendations returned. Rice and Sugarcane tied at 100%, which exposes the coarse scoring model.
- `POST /api/predict` with invalid soil: HTTP 400, as expected.
- `GET /api/weather?city=Vellore`: fallback baseline returned with `simulated: true`.
- `GET /api/geocode?city=Vellore`: provider request failed in this environment.
- `GET /api/soil?...`: regional fallback returned.
- `GET /api/location-intelligence?city=Vellore`: failed because geocoding could not be reached.
- Media endpoints returned curated image/video fallbacks.
- `npm test` in the server folder after adding route tests: **10 passed, 0 failed**.
- Client build attempt: failed using the archived `node_modules` because the platform-specific Rolldown native binding was missing. This can happen when dependency folders are zipped across operating systems; install from the lockfile rather than shipping `node_modules`.

## Important loopholes and risks

### High priority

1. **Secrets/config files were included in the original ZIP.** `.env` files should never be distributed. They have been excluded from the cleaned package; use `.env.example` and create local `.env` files yourself. If any real API/service credential was included in a shared ZIP or public repository, rotate it.
2. **Demo identity is not authentication.** A name/email form or preset profile does not prove identity and must never grant access to private cloud data. The client was adjusted to label demo history as local-only and prevent demo profiles from writing to Firestore.
3. **Cloud status needs truthful UI.** A configured endpoint or an HTTP 200 from a fallback is not proof that every upstream API is live. Display source/fallback metadata and test provider status separately.
4. **Agronomy values are not personalized prescriptions.** Fertilizer plans are fixed per crop; there is no farm-area scaling, crop variety, soil-test nutrient recommendation, irrigation model, or region-specific extension validation. UI warning text was added.

### Medium priority

5. **No trained ML model or model evaluation.** The title “prediction” can be interpreted as machine learning, but the implementation is a deterministic rule-based scorer. State this clearly in the report/viva, or train and evaluate a real model with a documented dataset, split, metrics, and model artifact.
6. **Scoring is simplistic.** Equal weighting, hard thresholds, a fixed mismatch score and broad crop ranges create ties and may rank crops poorly. The score is a compatibility heuristic, not a calibrated probability or validated percentage chance of success.
7. **Rainfall is not auto-detected.** Location lookup updates soil texture, pH and temperature, but rainfall remains whatever the form already contains. It must be presented as a manual seasonal estimate, not live location data.
8. **Soil fallback can be mistaken for actual soil data.** A generic latitude-based fallback is useful for UI resilience but is not a location-specific SoilGrids result. The source/confidence label was clarified.
9. **Thin tests.** The added route tests cover health and prediction success/validation; tests still do not cover auth, Firestore, Netlify routing, browser behavior, security, or live API failures.
10. **Operational hardening is limited.** No rate limiting, request logging/correlation IDs, structured timeouts for every upstream provider, or broad security test suite was found. CORS relies on `CLIENT_ORIGIN`; production must set it to the exact deployed origin.

## Recommended next steps

1. Create local environment files from the examples and configure only the services needed for the demo.
2. Run clean dependency installs from `package-lock.json`, then run server tests and a fresh client production build.
3. Verify the deployed `/api/health`, `/api/predict`, geocoding, weather and soil routes in the target hosting environment.
4. Test Google OAuth with an actual authorized account and verify create/read/delete behavior in Firestore security rules.
5. Extend tests to cover upstream failures, fallback labels, malformed requests, and authorization boundaries.
6. If the project is meant to claim ML prediction, add a reproducible model training/evaluation pipeline. Otherwise describe it honestly as a rules-based expert recommendation prototype.
7. Have fertilizer dosage, yield estimates, pesticide references, and crop schedules reviewed against appropriate local agricultural extension recommendations before presenting them as advice for farmers.

## Reproducibility commands

```bash
cd server
npm ci
npm test
npm run dev
```

In a second terminal:

```bash
cd client
npm ci
npm run build
npm run dev
```

Copy `.env.example` to `.env` separately in each package and configure credentials locally. Do not commit or share `.env` files.
