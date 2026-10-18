# Academic Project Submission Dossier

**Course:** CSI3001 — Cloud Computing Methodologies  
**Project Title:** SMART-CROP PREDICTION SYSTEM: A CLOUD-BASED PRECISION AGRICULTURE AND RECOMMENDATION PLATFORM  
**Student Name:** Neha Sudhan  
**Registration Number:** 24MID0326  
**Faculty In-Charge:** Dr. Kakelli Anil Kumar  
**Institution:** Vellore Institute of Technology (VIT), Vellore  

---

## 📌 1. Project Compliance & Verification Matrix

This project has been implemented to satisfy all specifications stated in the submitted proposal document:

| Deliverable / Promise from Proposal | Module / File in Project | Implementation Verification | Status |
| :--- | :--- | :--- | :---: |
| **Cloud-Native Full-Stack Architecture** | React.js (`client/`) + Express.js (`server/`) | Vite SPA + RESTful API orchestration | ✅ **Complete** |
| **OpenWeatherMap Meteorological API** | `server/src/index.js` (`/api/weather`) | Live temperature, humidity, and condition fetching | ✅ **Complete** |
| **ISRIC SoilGrids v2.0 REST API** | `server/src/soilgrids.js` (`/api/soil`) | Fetches satellite pH, SOC (organic carbon), clay/sand ratios | ✅ **Complete** |
| **OpenStreetMap Nominatim Geocoding** | `server/src/index.js` (`/api/location-intelligence`) | Resolves city/district into coordinates to auto-populate soil & climate | ✅ **Complete** |
| **Precision Fertilizer Plans (Urea, DAP, MOP)** | `server/src/crops.js` & `client/src/App.jsx` | Explicit dosages (kg/acre), NPK targets, and 3-stage split application | ✅ **Complete** |
| **Step-by-Step Cultivation Schedules** | `server/src/crops.js` & `client/src/App.jsx` | Chronological farm milestones from land preparation to harvest | ✅ **Complete** |
| **Pexels / Unsplash Visual Media API** | `server/src/media.js` | Crop photography display with fallback resilience | ✅ **Complete** |
| **YouTube Data API v3 Educational Media** | `server/src/media.js` & `client/src/App.jsx` | Interactive video player modals with cultivation tutorial guides | ✅ **Complete** |
| **Client-Side Document Generator (jsPDF)** | `client/src/report.js` | Downloadable multi-page agricultural advisory PDF | ✅ **Complete** |
| **Firebase Auth & Cloud Firestore** | `client/src/firebase.js` & `firestore.rules` | Google OAuth state and real-time cloud assessment history drawer | ✅ **Complete** |
| **Firebase Admin SDK Backend** | `server/src/firebaseAdmin.js` | Cloud backend administration module | ✅ **Complete** |
| **Tailwind CSS & Modern UI** | `client/tailwind.config.js` & `styles.css` | Tailwind CSS v4 + responsive field-notes design system | ✅ **Complete** |
| **Netlify Serverless Deployment** | `netlify.toml` & `netlify/functions/api.js` | Serverless wrapper for Express + static SPA continuous delivery | ✅ **Complete** |
| **Automated Testing Suite** | `server/test/recommendation.test.js` | 7 automated unit/integration test cases passing | ✅ **Complete** |

---

## 🛠️ 2. How to Run the Project (For Evaluation)

### Step 1: Run Backend API & Automated Tests
```powershell
cd server
npm test     # Runs 7 test suites validating scoring, SoilGrids, & fertilizer dosing
npm run dev  # Starts the Express REST API on http://localhost:4000
```

### Step 2: Run Frontend Dashboard
```powershell
cd client
npm run dev  # Starts the React + Vite dashboard on http://localhost:5173
```

---

## 🌾 3. Evaluation & Demo Walkthrough Script

When demonstrating the project during your lab evaluation or viva:

1. **Open the Dashboard (`http://localhost:5173`)**:
   * Show the header with course metadata (*CSI3001 Cloud Computing Methodologies, VIT Vellore*).
2. **Demonstrate Automated Location Intelligence**:
   * In the **"Automated Soil & Weather Auto-Detect"** bar, enter `Vellore` (or `Coimbatore`, `Pune`, `Ludhiana`).
   * Click **"Auto-Detect Field Data"**.
   * Point out the green badge: it queries **OpenStreetMap Nominatim** for coordinates and **ISRIC SoilGrids v2.0 REST API** to determine soil pH (e.g. 7.1), organic carbon (25.9 g/kg), and soil texture (**Black soil / Vertisol**).
3. **Assess Suitability**:
   * Click **"Assess Crop Suitability"**.
   * Point out the top recommended crop match with compatibility score (e.g., 95/100).
4. **Showcase Fertilizer Plans (Urea, DAP, MOP)**:
   * Click the **"Fertilizer Plan (Urea, DAP, MOP)"** tab.
   * Explain the 3 metric badges displaying exact dosage per acre:
     * **Urea (Nitrogen - N)**
     * **DAP (Phosphorus - P)**
     * **MOP (Potassium - K)**
   * Show the **Split Application Schedule table** (Basal at sowing, Active Tillering, Panicle Initiation).
5. **Showcase Step-by-Step Cultivation Schedule**:
   * Click the **"Cultivation Schedule"** tab.
   * Point out the growth phases (Nursery, Main Field Transplanting, Tillering, Flowering, Harvest) with timelines in days.
6. **Showcase Educational Video (YouTube API)**:
   * Click **"Watch Cultivation Guide Video"** to open the interactive modal with the embedded player.
7. **Demonstrate Cloud History (Firebase Firestore)**:
   * Click **"Save to Cloud History"**.
   * In the top-right header, click **"Cloud History (1)"** to slide out the history drawer, showing stored plot decisions and the **"Load into Workspace"** feature.
8. **Demonstrate Offline Report Generation**:
   * Click **"Download Full PDF Report"**.
   * Open the generated PDF to show the multi-page document with student attribution, plot snapshot, and fertilizer/cultivation tables.

---

## 💡 4. Viva Q&A Cheat Sheet

* **Q: Why is SoilGrids used instead of manual entry alone?**
  * *A:* ISRIC SoilGrids v2.0 is a global digital soil mapping system using machine learning models fitted on over 240,000 soil profiles combined with Earth observation satellite covariates. It provides standard depths (0–5 cm) for pH, organic carbon, and sand/clay fractions to infer soil taxonomy without requiring physical soil lab visits.
* **Q: What is the significance of the 3-split fertilizer schedule?**
  * *A:* Basal DAP supplies phosphorus for early root establishment. Nitrogen (Urea) is split to prevent leaching losses, volatilization, and denitrification, timed with crop vegetative growth and flowering demand. Potassium (MOP) is timed for grain filling and disease resistance.
* **Q: How does Netlify host both React and Express?**
  * *A:* The frontend is built as static assets served from Netlify's high-speed CDN edges (`client/dist`), while the Express backend is adapted into Netlify serverless functions (`netlify/functions/api.js`) via `serverless-http`, enabling serverless scalability without dedicated VM hosting costs.
