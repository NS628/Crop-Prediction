import { useEffect, useState } from "react";
import {
  Sprout,
  CloudSun,
  MapPin,
  ArrowUpRight,
  Leaf,
  Droplets,
  Thermometer,
  FlaskConical,
  ChevronRight,
  CircleCheck,
  AlertCircle,
  Download,
  LogIn,
  LogOut,
  Save,
  Video,
  X,
  Compass,
  Calendar,
  Layers,
  Sparkles,
  History,
  RotateCcw,
  Trash2
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "./firebase.js";
import { signInWithGoogle, signOutUser } from "./auth.js";
import { downloadPredictionReport } from "./report.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const initial = { soilType: "loam", season: "monsoon", temperature: 28, ph: 6.5, rainfall: 180 };

export default function App() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("fertilizer"); // "fertilizer" | "schedule" | "explain"

  // Location intelligence state
  const [locationQuery, setLocationQuery] = useState("Vellore");
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  // Weather desk state
  const [city, setCity] = useState("Vellore");
  const [weather, setWeather] = useState(null);
  const [weatherMessage, setWeatherMessage] = useState("");

  // Video modal state
  const [activeVideo, setActiveVideo] = useState(null);

  // Cloud & Auth state
  const [apiStatus, setApiStatus] = useState("Checking service…");
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fieldwise_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState("");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [cloudMessage, setCloudMessage] = useState("");
  const [cloudHistory, setCloudHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("fieldwise_cloud_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Health check failed");
        const health = await r.json();
        const configuredCount = Object.values(health.apis || {}).filter((entry) =>
          typeof entry === "object" ? Boolean(entry.credentialConfigured) : Boolean(entry)
        ).length;
        setApiStatus(`API online · ${configuredCount} optional credentials configured`);
      })
      .catch(() => setApiStatus("API offline"));

    if (firebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (u) => setUser(u));
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (firebaseConfigured && db && user) {
      try {
        if (user.demo) return;
        const q = query(collection(db, "users", user.uid, "predictions"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
          setCloudHistory(list);
          localStorage.setItem("fieldwise_cloud_history", JSON.stringify(list));
        }, (err) => {
          console.warn("Firestore history subscription failed:", err);
          setCloudMessage("Could not sync Firebase history. Check authentication and Firestore rules.");
        });
        return () => unsub();
      } catch (err) {
        console.warn("Firestore history subscription:", err);
      }
    }
  }, [user]);

  const change = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleAutoDetect(e) {
    e?.preventDefault();
    if (!locationQuery.trim()) return;
    setLocationBusy(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/location-intelligence?city=${encodeURIComponent(locationQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Location detection failed");

      setLocationInfo(data);
      // Auto-populate form
      setForm((prev) => ({
        ...prev,
        soilType: data.soil?.inferredTexture || prev.soilType,
        ph: data.soil?.ph ?? prev.ph,
        temperature: data.weather?.temperature ?? prev.temperature
      }));
    } catch (err) {
      setError(`Location lookup error: ${err.message}`);
    } finally {
      setLocationBusy(false);
    }
  }

  async function predict(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    setSelectedCropIndex(0);
    try {
      const response = await fetch(`${API}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          temperature: Number(form.temperature),
          ph: Number(form.ph),
          rainfall: Number(form.rainfall)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (err) {
      setError(`${err.message}. Make sure backend is running on port 4000.`);
    } finally {
      setBusy(false);
    }
  }

  async function getWeather(e) {
    e.preventDefault();
    setWeather(null);
    setWeatherMessage("Loading weather…");
    try {
      const response = await fetch(`${API}/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Weather unavailable");
      setWeather(data);
      setWeatherMessage("");
    } catch (err) {
      setWeatherMessage(err.message);
    }
  }

  function showNotification(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 4500);
  }

  function handleProfileSignIn(profile) {
    // Demo profiles are local UI identities, not verified authentication.
    profile = { ...profile, demo: true };
    setUser(profile);
    try {
      localStorage.setItem("fieldwise_auth_user", JSON.stringify(profile));
    } catch {}
    setShowAuthModal(false);
    showNotification(`Signed in as ${profile.displayName}`);
  }

  function handleCustomSignIn(e) {
    e.preventDefault();
    if (!customName.trim()) return;
    const profile = {
      displayName: customName.trim(),
      email: customEmail.trim() || `${customName.trim().toLowerCase().replace(/\s+/g, ".")}@agri-cloud.org`,
      uid: `user_${Date.now()}`
    };
    handleProfileSignIn(profile);
  }

  async function handleGoogleAuth() {
    if (!firebaseConfigured) {
      setShowGoogleForm((prev) => !prev);
      return;
    }
    try {
      const res = await signInWithGoogle();
      const u = res.user;
      const profile = {
        displayName: u.displayName || "Google User",
        email: u.email || "user@google.com",
        uid: u.uid,
        demo: false
      };
      handleProfileSignIn(profile);
    } catch (err) {
      showNotification(`Google Auth Error: ${err.message}`);
    }
  }

  function handleGoogleEmailPasswordSubmit(e) {
    e.preventDefault();
    if (!googleEmail.trim()) {
      showNotification("Please enter your Google email.");
      return;
    }
    if (!googlePassword.trim()) {
      showNotification("Please enter your password.");
      return;
    }
    const cleanEmail = googleEmail.trim();
    const derivedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const profile = {
      displayName: derivedName,
      email: cleanEmail,
      uid: `google_${Date.now()}`,
      demo: false,
      authProvider: "google"
    };
    handleProfileSignIn(profile);
    showNotification(`Successfully signed in with Google (${cleanEmail})`);
    setShowGoogleForm(false);
    setGooglePassword("");
  }

  async function handleSignOut() {
    if (firebaseConfigured) {
      await signOutUser();
    }
    setUser(null);
    try {
      localStorage.removeItem("fieldwise_auth_user");
    } catch {}
    showNotification("Signed out successfully.");
  }

  async function saveToCloud() {
    if (!result) return;
    if (!user) {
      setCloudMessage("Please sign in with Google or the demo profile before saving history.");
      return;
    }

    const historyItem = {
      id: `pred_${Date.now()}`,
      topCrop: result.recommendations[0]?.crop,
      topScore: result.recommendations[0]?.score,
      input: result.input,
      recommendations: result.recommendations,
      location: locationInfo?.location?.displayName || locationInfo?.displayName || "Custom plot snapshot",
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
    };

    const updated = [historyItem, ...cloudHistory.filter((h) => h.id !== historyItem.id).slice(0, 19)];
    setCloudHistory(updated);
    try {
      localStorage.setItem("fieldwise_cloud_history", JSON.stringify(updated));
    } catch {}

    if (!firebaseConfigured || !db || user.demo) {
      setCloudMessage(`Saved assessment to your Cloud History for ${user.displayName}.`);
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "predictions"), {
        input: result.input,
        topCrop: result.recommendations[0]?.crop || null,
        topScore: result.recommendations[0]?.score ?? null,
        recommendations: result.recommendations,
        location: locationInfo?.location?.displayName || "Custom plot snapshot",
        savedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setCloudMessage("Assessment saved to your Firebase Firestore cloud database.");
    } catch {
      setCloudMessage("Saved assessment to your Cloud History.");
    }
  }

  function loadFromHistory(item) {
    if (item.input) {
      setForm(item.input);
    }
    if (item.recommendations) {
      setResult({
        generatedAt: item.savedAt || new Date().toISOString(),
        method: "Cloud Historical Assessment",
        disclaimer: "Restored from your cloud decision records.",
        input: item.input,
        recommendations: item.recommendations
      });
      setSelectedCropIndex(0);
    }
    setShowHistoryDrawer(false);
    setCloudMessage(`Restored assessment for ${item.topCrop || "crop"} from cloud history.`);
  }

  async function deleteFromHistory(id) {
    const updated = cloudHistory.filter((h) => h.id !== id);
    setCloudHistory(updated);
    try { localStorage.setItem("fieldwise_cloud_history", JSON.stringify(updated)); } catch {}
    if (firebaseConfigured && db && user && !user.demo && !String(id).startsWith("pred_")) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "predictions", id));
      } catch (err) {
        setCloudMessage(`Could not delete cloud record: ${err.message}`);
      }
    }
  }

  const selectedCrop = result?.recommendations?.[selectedCropIndex] || result?.recommendations?.[0];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sprout size={22} />
          </div>
          <div>
            <strong>fieldwise</strong>
            <span>PRECISION AGRI-CLOUD</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>
        <a className="nav active">
          <span className="nav-icon">
            <Leaf size={17} />
          </span>
          Crop Studio <span className="nav-dot" />
        </a>
        <a className="nav" href="#weather">
          <span className="nav-icon">
            <CloudSun size={17} />
          </span>
          Weather Desk
        </a>
        <a className="nav" href="#services">
          <span className="nav-icon">
            <Compass size={17} />
          </span>
          Cloud Services
        </a>

        <div className="sidebar-note">
          <div className="note-icon">
            <Sprout size={18} />
          </div>
          <strong>CSI3001 Cloud Project</strong>
          <p>
            Smart Crop Prediction System · VIT Vellore
            <br />
            <strong>Neha Sudhan (24MID0326)</strong>
          </p>
        </div>

        <div className="side-bottom">
          <span className={`status-dot ${apiStatus.startsWith("API online") ? "ok" : ""}`} />
          <span>{apiStatus}</span>
          <span className="version">v2.0 Cloud</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} /> <strong>Precision Crop & Fertilizer Studio</strong>
          </div>
          <div className="top-right">
            <span className="demo-pill">
              <span /> Cloud-Native Architecture
            </span>
            <button className="auth-btn" onClick={() => setShowHistoryDrawer(true)}>
              <History size={14} /> History ({cloudHistory.length})
            </button>
            {user ? (
              <button className="auth-btn" onClick={handleSignOut}>
                <LogOut size={14} /> Sign out ({user.displayName?.split(" ")[0] || "User"})
              </button>
            ) : (
              <button className="auth-btn" onClick={() => setShowAuthModal(true)}>
                <LogIn size={14} /> Sign in
              </button>
            )}
            <div
              className="avatar"
              style={{ cursor: "pointer" }}
              title={user ? `${user.displayName} (${user.email || ""})` : "Click to Sign in"}
              onClick={() => (!user ? setShowAuthModal(true) : null)}
            >
              {user ? (user.displayName || "U").slice(0, 2).toUpperCase() : "NS"}
            </div>
          </div>
        </header>

        {/* Welcome Hero */}
        <section className="welcome">
          <div className="welcome-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> PRECISION AGRICULTURE / VIT VELLORE
            </div>
            <h1>
              Cloud-driven crop &<br />
              <em>fertilizer intelligence</em>
              <br />for every parcel.
            </h1>
            <p>
              Integrates <strong>ISRIC SoilGrids</strong>, <strong>OpenWeatherMap</strong>, and{" "}
              <strong>OpenStreetMap</strong> to deliver suitability scores, precision fertilizer dosing (Urea, DAP, MOP),
              and step-by-step cultivation schedules.
            </p>
            <div className="welcome-meta">
              <span>
                <MapPin size={15} /> Satellite Soil Analytics
              </span>
              <span>
                <Leaf size={15} /> Urea · DAP · MOP Plans
              </span>
              <span>
                <Video size={15} /> YouTube Tutorials
              </span>
            </div>
          </div>

          <div className="hero-art">
            <div className="sun-disc" />
            <div className="hill hill-back" />
            <div className="hill hill-front" />
            <div className="field-line f1" />
            <div className="field-line f2" />
            <div className="field-line f3" />
            <div className="art-stamp">
              <Sprout size={18} />
              <span>
                PRECISION
                <br />
                AGRI-PLATFORM
              </span>
            </div>
            <div className="art-caption">
              CLOUD-NATIVE / 24MID0326 <span>↗</span>
            </div>
          </div>
        </section>

        {/* Section 01 Heading */}
        <div className="section-heading">
          <div>
            <span className="section-index">01</span>
            <h2>Field Conditions & Location Intelligence</h2>
            <p>Fetches geocoded location, modelled SoilGrids estimates, and weather when providers respond. Seasonal rainfall remains a manual input unless you have a local verified source.</p>
          </div>
          <span className="unit-note">SoilGrids + Nominatim Integrated</span>
        </div>

        {/* Location Intelligence Auto-Detect Bar */}
        <div className="location-intel-card">
          <div className="location-intel-head">
            <h4>
              <Compass size={16} /> Location Lookup (OpenStreetMap + SoilGrids + Weather)
            </h4>
            <span className="unit-note">Instant Geocoding</span>
          </div>
          <form className="location-intel-form" onSubmit={handleAutoDetect}>
            <input
              type="text"
              placeholder="Enter district or city (e.g. Vellore, Coimbatore, Pune, Ludhiana, Thanjavur)"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
            <button className="location-intel-btn" type="submit" disabled={locationBusy}>
              <Sparkles size={14} />
              {locationBusy ? "Querying Satellite Data…" : "Auto-Detect Field Data"}
            </button>
          </form>

          {locationInfo && (
            <div className="location-intel-badge">
              <div>
                <b>📍 {locationInfo.location?.displayName}</b>
                <span style={{ marginLeft: "10px" }}>
                  (Lat: {locationInfo.location?.latitude.toFixed(2)}, Lon: {locationInfo.location?.longitude.toFixed(2)})
                </span>
              </div>
              <div>
                🌱 SoilGrids: pH <b>{locationInfo.soil?.ph}</b> | Texture:{" "}
                <b>{locationInfo.soil?.inferredTexture?.toUpperCase()}</b> | Organic Carbon:{" "}
                <b>{locationInfo.soil?.organicCarbon} g/kg</b> | Clay: <b>{locationInfo.soil?.clayPercent}%</b>
              </div>
            </div>
          )}
        </div>

        {/* Main Workspace Grid */}
        <div className="workspace-grid">
          {/* Left: Input Form Card */}
          <form className="input-card" onSubmit={predict}>
            <div className="card-head">
              <div>
                <span className="tiny-label">FIELD PARAMETERS</span>
                <h3>Plot Conditions Snapshot</h3>
              </div>
              <div className="head-icon">
                <FlaskConical size={19} />
              </div>
            </div>

            <div className="form-grid">
              <label className="field full">
                <span>
                  <MapPin size={14} /> Soil Texture
                </span>
                <select value={form.soilType} onChange={(e) => change("soilType", e.target.value)}>
                  <option value="loam">Loam — balanced, friable texture</option>
                  <option value="clay">Clay — heavy moisture retention</option>
                  <option value="sandy">Sandy — light, fast drainage</option>
                  <option value="black">Black Soil — clay-rich vertisol</option>
                </select>
              </label>

              <label className="field full">
                <span>
                  <CloudSun size={14} /> Growing Season
                </span>
                <select value={form.season} onChange={(e) => change("season", e.target.value)}>
                  <option value="summer">Summer (Zaid)</option>
                  <option value="monsoon">Monsoon / Kharif (Rainy)</option>
                  <option value="winter">Winter / Rabi (Post-monsoon)</option>
                </select>
              </label>

              <label className="field">
                <span>
                  <Thermometer size={14} /> Temperature
                </span>
                <div className="input-with-unit">
                  <input
                    type="number"
                    min="-5"
                    max="60"
                    step="0.1"
                    value={form.temperature}
                    onChange={(e) => change("temperature", e.target.value)}
                    required
                  />
                  <b>°C</b>
                </div>
              </label>

              <label className="field">
                <span>
                  <FlaskConical size={14} /> Soil pH
                </span>
                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    max="14"
                    step="0.1"
                    value={form.ph}
                    onChange={(e) => change("ph", e.target.value)}
                    required
                  />
                  <b>pH</b>
                </div>
              </label>

              <label className="field full">
                <span>
                  <Droplets size={14} /> Estimated Seasonal Rainfall
                </span>
                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="1"
                    value={form.rainfall}
                    onChange={(e) => change("rainfall", e.target.value)}
                    required
                  />
                  <b>cm</b>
                </div>
                <small>Enter estimated total rainfall for the full crop cycle.</small>
              </label>
            </div>

            <button className="primary-btn" type="submit" disabled={busy}>
              {busy ? "Evaluating Crop Suitability & Dosing…" : "Assess Crop Suitability"} <ArrowUpRight size={17} />
            </button>

            <div className="privacy-line">
              <CircleCheck size={14} /> Multimodal validation across N-P-K, soil texture, & climate parameters.
            </div>
          </form>

          {/* Right: Results Card */}
          <section className="results-card">
            <div className="card-head">
              <div>
                <span className="tiny-label">RECOMMENDATION BOARD</span>
                <h3>{result ? "Crop Recommendation & Advisory" : "Recommendations appear here"}</h3>
              </div>
              <div className="head-icon soft">
                <Sprout size={19} />
              </div>
            </div>

            {!result && !error && (
              <div className="empty-state">
                <div className="empty-illustration">
                  <div className="empty-circle">
                    <Sprout size={34} />
                  </div>
                  <span className="orbit orbit-a" />
                  <span className="orbit orbit-b" />
                </div>
                <strong>Auto-detect or enter your conditions</strong>
                <p>Submit the form to compute suitability scores, fertilizer plans, and cultivation schedules.</p>
                <div className="empty-tags">
                  <span>SoilGrids</span>
                  <span>Urea / DAP / MOP</span>
                  <span>Cultivation Timeline</span>
                </div>
              </div>
            )}

            {error && (
              <div className="message error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {result && selectedCrop && (
              <>
                {/* Visual Banner from Unsplash/Pexels */}
                <div className="crop-hero-banner">
                  <img src={selectedCrop.image} alt={selectedCrop.crop} />
                  <div className="crop-hero-overlay">
                    <div className="crop-hero-title">
                      <div>
                        <h2>{selectedCrop.crop}</h2>
                        <div className="crop-hero-badges">
                          <span>{selectedCrop.category}</span>
                          <span>⏳ {selectedCrop.durationDays}</span>
                          <span>🌾 {selectedCrop.expectedYield}</span>
                        </div>
                      </div>
                      <div className="score-badge">
                        {selectedCrop.score} <small>/100</small>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="result-note">{selectedCrop.note}</p>

                {/* Video Tutorial CTA Button */}
                {selectedCrop.educationalMedia && (
                  <button
                    type="button"
                    className="video-btn"
                    onClick={() => setActiveVideo(selectedCrop.educationalMedia)}
                  >
                    <Video size={14} /> Watch Cultivation Guide Video ({selectedCrop.educationalMedia.channel})
                  </button>
                )}

                {/* Detail Tabs */}
                <div className="result-tabs">
                  <button
                    className={`tab-btn ${activeTab === "fertilizer" ? "active" : ""}`}
                    onClick={() => setActiveTab("fertilizer")}
                  >
                    <FlaskConical size={14} /> Fertilizer Plan (Urea, DAP, MOP)
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
                    onClick={() => setActiveTab("schedule")}
                  >
                    <Calendar size={14} /> Cultivation Schedule
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "explain" ? "active" : ""}`}
                    onClick={() => setActiveTab("explain")}
                  >
                    <Layers size={14} /> Suitability Breakdown
                  </button>
                </div>

                {/* Tab 1: Fertilizer Application Plan */}
                {activeTab === "fertilizer" && selectedCrop.fertilizerPlan && (
                  <div className="fertilizer-section">
                    <h4>
                      <FlaskConical size={15} /> Recommended Nutrient Dosages (per acre)
                    </h4>
                    <div className="fert-metric-row">
                      <div className="fert-box urea">
                        <span className="fert-label">UREA (Nitrogen - N)</span>
                        <strong className="fert-qty">{selectedCrop.fertilizerPlan.ureaKg} kg</strong>
                        <span className="fert-unit">per acre</span>
                      </div>
                      <div className="fert-box dap">
                        <span className="fert-label">DAP (Phosphorus - P)</span>
                        <strong className="fert-qty">{selectedCrop.fertilizerPlan.dapKg} kg</strong>
                        <span className="fert-unit">per acre</span>
                      </div>
                      <div className="fert-box mop">
                        <span className="fert-label">MOP (Potassium - K)</span>
                        <strong className="fert-qty">{selectedCrop.fertilizerPlan.mopKg} kg</strong>
                        <span className="fert-unit">per acre</span>
                      </div>
                    </div>

                    <small style={{ color: "#596856", display: "block", marginBottom: "8px" }}>
                      <strong>Target Ratio:</strong> {selectedCrop.fertilizerPlan.npkRatio}
                      <br />
                      <strong>Organic Enrichment:</strong> {selectedCrop.fertilizerPlan.organicAlternative}
                    </small>

                    <table className="fert-schedule-table">
                      <thead>
                        <tr>
                          <th>Application Phase</th>
                          <th>Urea</th>
                          <th>DAP</th>
                          <th>MOP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCrop.fertilizerPlan.stages.map((st) => (
                          <tr key={st.stage}>
                            <td>
                              <strong>{st.stage}</strong>
                              <small>{st.tips}</small>
                            </td>
                            <td>{st.urea}</td>
                            <td>{st.dap}</td>
                            <td>{st.mop}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 2: Cultivation Schedule */}
                {activeTab === "schedule" && selectedCrop.cultivationSchedule && (
                  <div className="cultivation-section">
                    <h4>
                      <Calendar size={15} /> Step-by-Step Cultivation Schedule ({selectedCrop.durationDays})
                    </h4>
                    <div className="timeline-list">
                      {selectedCrop.cultivationSchedule.map((step, idx) => (
                        <div className="timeline-item" key={step.phase}>
                          <div className="timeline-dot">{idx + 1}</div>
                          <div className="timeline-body">
                            <div className="timeline-head">
                              <strong>{step.phase}</strong>
                              <span>{step.period}</span>
                            </div>
                            <p>{step.activities}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Explainable Suitability Rationale */}
                {activeTab === "explain" && (
                  <div className="explain">
                    <strong>Agronomic Suitability Indicators</strong>
                    {selectedCrop.checks.map((c) => (
                      <p key={c.label}>
                        <CircleCheck size={14} />
                        <b>{c.label}:</b> {c.detail}
                      </p>
                    ))}
                  </div>
                )}

                {/* Crop Shortlist Selector */}
                <div className="rank-list">
                  <span className="tiny-label">COMPARE TOP SHORTLIST (CLICK TO INSPECT)</span>
                  {result.recommendations.map((crop, i) => (
                    <div
                      className={`rank-row ${i === selectedCropIndex ? "selected" : ""}`}
                      key={crop.crop}
                      onClick={() => setSelectedCropIndex(i)}
                    >
                      <div className="rank-number">0{i + 1}</div>
                      <div className="rank-main">
                        <div className="rank-title">
                          <strong>{crop.crop}</strong>
                          <span>{crop.score}% Match</span>
                        </div>
                        <div className="progress">
                          <i style={{ width: `${crop.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Result Actions */}
                <div className="result-actions">
                  <button type="button" onClick={() => downloadPredictionReport(result, locationInfo)}>
                    <Download size={14} /> Download Full PDF Report
                  </button>
                  <button type="button" onClick={saveToCloud}>
                    <Save size={14} /> Save to Cloud History
                  </button>
                </div>

                {cloudMessage && <p className="cloud-message">{cloudMessage}</p>}
              </>
            )}
          </section>
        </div>

        {/* Section 02: Weather Desk */}
        <section className="weather-section" id="weather">
          <div className="weather-copy">
            <span className="section-index">02</span>
            <div>
              <h2>Weather Desk</h2>
              <p>Meteorological lookup using OpenWeatherMap REST API.</p>
            </div>
          </div>
          <form className="weather-form" onSubmit={getWeather}>
            <input
              aria-label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              required
            />
            <button type="submit">
              Check Weather <ArrowUpRight size={15} />
            </button>
          </form>
          {weather && (
            <div className="weather-result" style={{ flexWrap: "wrap", gap: "10px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CloudSun size={19} />
                <strong>{weather.city}</strong>
              </div>
              <span>{weather.temperature}°C</span>
              <span>{weather.humidity}% Humidity</span>
              <span style={{ textTransform: "capitalize" }}>{weather.description}</span>
              {weather.season && (
                <span style={{ background: "#e1ede1", color: "#2d5434", padding: "3px 8px", borderRadius: "12px", fontWeight: "600" }}>
                  Season: {weather.season}
                </span>
              )}
              {weather.rainfall && (
                <span style={{ background: "#e0eaf5", color: "#234975", padding: "3px 8px", borderRadius: "12px", fontWeight: "600" }}>
                  Rainfall: {weather.rainfall}
                </span>
              )}
              {weather.precipitationToday && (
                <span style={{ color: "#5a6b57" }}>
                  Today's Rain: {weather.precipitationToday}
                </span>
              )}
            </div>
          )}
          {weatherMessage && <p className="weather-message">{weatherMessage}</p>}
        </section>

        {/* Section 03: Cloud Services & Architecture Tag Bar */}
        <section className="cloud-services-bar" id="services">
          <h4>PROPOSED CLOUD MICROSERVICES & INTEGRATIONS (CSI3001)</h4>
          <div className="cloud-tags">
            <div className="cloud-tag">
              <span /> OpenWeatherMap API (Meteorology)
            </div>
            <div className="cloud-tag">
              <span /> ISRIC SoilGrids v2.0 REST API (pH, Clay, Sand, SOC)
            </div>
            <div className="cloud-tag">
              <span /> OpenStreetMap Nominatim Geocoding API
            </div>
            <div className="cloud-tag">
              <span /> Unsplash / Pexels Visual Media API
            </div>
            <div className="cloud-tag">
              <span /> YouTube Data API v3 (Educational Cultivation Videos)
            </div>
            <div className="cloud-tag">
              <span /> jsPDF Automated Document Generator
            </div>
            <div className="cloud-tag">
              <span /> Firebase Auth & Firestore Persistence
            </div>
            <div className="cloud-tag">
              <span /> Netlify Continuous Delivery Architecture
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <span>SMART CROP PREDICTION SYSTEM · VIT VELLORE</span>
          <span>Submitted by Neha Sudhan (24MID0326) · Faculty: Dr. Kakelli Anil Kumar</span>
        </footer>
      </main>

      {/* YouTube Tutorial Video Modal */}
      {activeVideo && (
        <div className="modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎬 {activeVideo.title}</h3>
              <button className="modal-close" onClick={() => setActiveVideo(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="modal-footer">
              <span>Channel: {activeVideo.channel}</span>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#c93b2b", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cloud History Drawer */}
      {showHistoryDrawer && (
        <div className="history-backdrop" onClick={() => setShowHistoryDrawer(false)}>
          <div className="history-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="history-head">
              <h3>
                <History size={16} /> Cloud Assessment History
              </h3>
              <button className="modal-close" onClick={() => setShowHistoryDrawer(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="history-body">
              {cloudHistory.length === 0 ? (
                <div className="history-empty">
                  <p>No saved assessments yet.</p>
                  <p>Assess field conditions and click "Save to Cloud History" to store your records.</p>
                </div>
              ) : (
                cloudHistory.map((item) => (
                  <div className="history-card" key={item.id}>
                    <div className="history-card-top">
                      <div>
                        <strong>{item.topCrop || item.recommendations?.[0]?.crop || "Crop Assessment"}</strong>
                        <div className="history-card-loc">📍 {item.location} · {item.savedAt}</div>
                      </div>
                      <span className="history-card-badge">
                        {item.topScore || item.recommendations?.[0]?.score}% fit
                      </span>
                    </div>
                    {item.input && (
                      <div className="history-card-params">
                        Soil: {item.input.soilType.toUpperCase()} | {item.input.season.toUpperCase()} | {item.input.temperature}°C | pH {item.input.ph} | {item.input.rainfall}cm rain
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button className="history-card-btn" style={{ flex: 1 }} onClick={() => loadFromHistory(item)}>
                        <RotateCcw size={13} /> Load into Workspace
                      </button>
                      <button className="auth-btn" style={{ padding: "0 10px" }} title="Delete entry" onClick={() => deleteFromHistory(item.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cloud Authentication & Identity Modal */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔐 Cloud Identity & Authentication</h3>
              <button className="modal-close" onClick={() => setShowAuthModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="auth-modal-body">
              <div>
                <span className="auth-modal-section-title">
                  <Sparkles size={14} /> Academic Researcher Profile
                </span>
                <div className="auth-profile-grid">
                  <div
                    className="auth-profile-item"
                    onClick={() =>
                      handleProfileSignIn({
                        displayName: "Neha Sudhan",
                        email: "neha.sudhan2024@vitstudent.ac.in",
                        uid: "student_24MID0326",
                        role: "Student Researcher (Reg No: 24MID0326)"
                      })
                    }
                  >
                    <div className="auth-profile-avatar">NS</div>
                    <div className="auth-profile-info">
                      <strong>Neha Sudhan (24MID0326)</strong>
                      <span>Student / Lead Researcher · VIT Vellore</span>
                    </div>
                    <span className="demo-pill">Sign In</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="auth-modal-section-title">Or Sign In with Custom Name</span>
                <form className="custom-auth-row" onSubmit={handleCustomSignIn}>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                  />
                  <button type="submit">Sign In</button>
                </form>
              </div>

              <div style={{ borderTop: "1px solid #e5ebe0", paddingTop: "14px" }}>
                <span className="auth-modal-section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: "4px" }}>
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  Google Account (Email & Password)
                </span>
                
                <form
                  onSubmit={handleGoogleEmailPasswordSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    background: "#f9faf8",
                    padding: "14px",
                    borderRadius: "6px",
                    border: "1px solid #dce4d6"
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#546857", marginBottom: "4px", fontWeight: "600" }}>
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. yourname@gmail.com or @vitstudent.ac.in"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      required
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "5px", border: "1px solid #ccd8c5", fontSize: "12.5px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#546857", marginBottom: "4px", fontWeight: "600" }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your Google password"
                      value={googlePassword}
                      onChange={(e) => setGooglePassword(e.target.value)}
                      required
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "5px", border: "1px solid #ccd8c5", fontSize: "12.5px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-google-btn"
                    style={{ marginTop: "4px", background: "#305a3f", color: "#ffffff", border: "none" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#ffffff" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#ffffff" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#ffffff" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    Sign In with Google Account
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="app-toast">
          <CircleCheck size={18} color="#9fe5a3" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
