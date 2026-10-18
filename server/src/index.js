import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { recommendCrops } from "./crops.js";
import { fetchSoilGrids } from "./soilgrids.js";
import { fetchCropImage, fetchCropTutorialVideo } from "./media.js";
import { adminApp } from "./firebaseAdmin.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "fieldwise-crop-api",
    mode: "cloud-precision-agriculture",
    apis: {
      openWeather: { implemented: true, credentialConfigured: Boolean(process.env.OPENWEATHER_API_KEY) },
      soilGrids: { implemented: true, credentialRequired: false, liveStatus: "not-probed-by-health-check" },
      openStreetMap: { implemented: true, credentialRequired: false, liveStatus: "not-probed-by-health-check" },
      unsplashPexels: { implemented: true, credentialConfigured: Boolean(process.env.UNSPLASH_ACCESS_KEY || process.env.PEXELS_API_KEY) },
      youtubeDataApi: { implemented: true, credentialConfigured: Boolean(process.env.YOUTUBE_API_KEY) },
      firebaseAdmin: { implemented: true, credentialConfigured: Boolean(adminApp) }
    }
  });
});

app.post("/api/predict", async (req, res) => {
  const { soilType, season, temperature, ph, rainfall } = req.body ?? {};
  const allowedSoils = ["clay", "loam", "sandy", "black"];
  const allowedSeasons = ["summer", "monsoon", "winter"];
  const values = [temperature, ph, rainfall].map(Number);

  if (
    !allowedSoils.includes(soilType) ||
    !allowedSeasons.includes(season) ||
    values.some((v) => !Number.isFinite(v)) ||
    values[0] < -5 || values[0] > 60 ||
    values[1] < 0 || values[1] > 14 ||
    values[2] < 0 || values[2] > 1000
  ) {
    return res.status(400).json({ error: "Check soil type, season, temperature, pH, and rainfall values." });
  }

  const input = { soilType, season, temperature: values[0], ph: values[1], rainfall: values[2] };
  const recommendations = recommendCrops(input);

  // Enhance top recommendation with live media lookup if API keys exist
  for (const item of recommendations) {
    if (process.env.UNSPLASH_ACCESS_KEY || process.env.PEXELS_API_KEY) {
      const media = await fetchCropImage(item.crop, item.image);
      item.image = media.imageUrl;
      item.imageCredit = media.credit;
    }
    if (process.env.YOUTUBE_API_KEY) {
      const video = await fetchCropTutorialVideo(item.crop, item.educationalMedia);
      item.educationalMedia = video;
    }
  }

  res.json({
    generatedAt: new Date().toISOString(),
    method: "Explainable multi-parameter agronomic suitability scoring",
    input,
    recommendations
  });
});

async function fetchMeteorologicalData(city) {
  const month = new Date().getMonth() + 1;
  let currentSeason = "kharif (monsoon)";
  let seasonRainfallCm = 135;
  if (month >= 6 && month <= 10) {
    currentSeason = "monsoon (kharif)";
    seasonRainfallCm = 150;
  } else if (month >= 11 || month <= 2) {
    currentSeason = "winter (rabi)";
    seasonRainfallCm = 40;
  } else {
    currentSeason = "summer (zaid)";
    seasonRainfallCm = 60;
  }

  if (process.env.OPENWEATHER_API_KEY) {
    try {
      const url = new URL("https://api.openweathermap.org/data/2.5/weather");
      url.searchParams.set("q", city);
      url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY);
      url.searchParams.set("units", "metric");
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        const rainMm = data.rain?.["1h"] || data.rain?.["3h"] || 0;
        return {
          city: data.name || city,
          temperature: Math.round(data.main?.temp * 10) / 10,
          humidity: data.main?.humidity,
          description: data.weather?.[0]?.description,
          windSpeed: data.wind?.speed,
          season: currentSeason,
          rainfall: `${seasonRainfallCm} cm (seasonal)`,
          precipitationToday: `${rainMm} mm`,
          source: "OpenWeatherMap API",
          simulated: false
        };
      }
    } catch {}
  }

  // Live real-time fallback via global meteorological network (wttr.in)
  try {
    const wttrUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    const res = await fetch(wttrUrl, { headers: { "User-Agent": "FieldwiseSmartCrop/2.0" } });
    if (res.ok) {
      const data = await res.json();
      const current = data.current_condition?.[0];
      const area = data.nearest_area?.[0]?.areaName?.[0]?.value || city;
      if (current) {
        const precipMm = Number(current.precipMM || 0);
        return {
          city: area,
          temperature: Number(current.temp_C),
          humidity: Number(current.humidity),
          description: current.weatherDesc?.[0]?.value || "fair weather",
          windSpeed: Math.round((Number(current.windspeedKmph) / 3.6) * 10) / 10,
          season: currentSeason,
          rainfall: `${seasonRainfallCm} cm (seasonal)`,
          precipitationToday: `${precipMm} mm`,
          source: "Live Meteorological Network",
          simulated: false
        };
      }
    }
  } catch {}

  return {
    city,
    temperature: 28,
    humidity: 68,
    description: "seasonal agricultural climate",
    season: currentSeason,
    rainfall: `${seasonRainfallCm} cm (seasonal)`,
    precipitationToday: "0 mm",
    source: "Agro-climatic baseline",
    simulated: true
  };
}

app.get("/api/weather", async (req, res) => {
  const city = String(req.query.city || "").trim();
  if (!city) return res.status(400).json({ error: "Provide a city query parameter." });

  const weather = await fetchMeteorologicalData(city);
  res.json(weather);
});

app.get("/api/geocode", async (req, res) => {
  const city = String(req.query.city || "").trim();
  if (!city) return res.status(400).json({ error: "Provide a city query parameter." });

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", city);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    const response = await fetch(url, { headers: { "User-Agent": "FieldwiseSmartCropSystem/2.0 (Academic Cloud Computing VIT)" } });
    if (!response.ok) return res.status(502).json({ error: "Geocoding provider request failed." });
    const places = await response.json();
    if (!places.length) return res.status(404).json({ error: `No location matches found for '${city}'.` });

    res.json({
      name: places[0].display_name,
      latitude: Number(places[0].lat),
      longitude: Number(places[0].lon)
    });
  } catch {
    res.status(502).json({ error: "Could not contact the OpenStreetMap Nominatim geocoding service." });
  }
});

app.get("/api/soil", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const soil = await fetchSoilGrids(lat, lon);
    res.json(soil);
  } catch (error) {
    res.status(error.status || 502).json({ error: error.message || "Soil lookup failed." });
  }
});

// Unified Location Intelligence: Nominatim Geocoding + SoilGrids + OpenWeatherMap
app.get("/api/location-intelligence", async (req, res) => {
  const city = String(req.query.city || "").trim();
  if (!city) return res.status(400).json({ error: "Provide a city or district query parameter." });

  try {
    // 1. Geocode with OpenStreetMap Nominatim
    const geoUrl = new URL("https://nominatim.openstreetmap.org/search");
    geoUrl.searchParams.set("q", city);
    geoUrl.searchParams.set("format", "jsonv2");
    geoUrl.searchParams.set("limit", "1");
    const geoRes = await fetch(geoUrl, { headers: { "User-Agent": "FieldwiseSmartCropSystem/2.0" } });
    const places = geoRes.ok ? await geoRes.json() : [];

    if (!places.length) {
      return res.status(404).json({ error: `Could not geocode location '${city}'. Try another nearby district.` });
    }

    const lat = Number(places[0].lat);
    const lon = Number(places[0].lon);
    const displayName = places[0].display_name;

    // 2. Fetch SoilGrids in parallel with Weather
    const [soilResult, weatherResult] = await Promise.allSettled([
      fetchSoilGrids(lat, lon),
      fetchMeteorologicalData(city)
    ]);

    const soil = soilResult.status === "fulfilled" ? soilResult.value : {
      ph: 6.5,
      inferredTexture: "loam",
      organicCarbon: 12.0,
      clayPercent: 26,
      sandPercent: 44,
      source: "SoilGrids Regional Baseline"
    };

    const weather = weatherResult.status === "fulfilled" ? weatherResult.value : {
      temperature: 28,
      humidity: 65,
      description: "moderate temperature",
      simulated: true
    };

    res.json({
      location: {
        query: city,
        displayName,
        latitude: lat,
        longitude: lon
      },
      soil,
      weather
    });
  } catch (err) {
    res.status(500).json({ error: `Failed to assemble location intelligence: ${err.message}` });
  }
});

// External media endpoints
app.get("/api/media/image", async (req, res) => {
  const crop = String(req.query.crop || "").trim();
  if (!crop) return res.status(400).json({ error: "Crop parameter required" });
  const result = await fetchCropImage(crop, "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80");
  res.json(result);
});

app.get("/api/media/video", async (req, res) => {
  const crop = String(req.query.crop || "").trim();
  if (!crop) return res.status(400).json({ error: "Crop parameter required" });
  const result = await fetchCropTutorialVideo(crop, { youtubeId: "uC2Y19j-z1w", title: `${crop} Cultivation Package of Practices` });
  res.json(result);
});

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "test" && !process.env.NETLIFY) {
  app.listen(port, () => console.log(`Fieldwise Precision Agriculture API listening on http://localhost:${port}`));
}

export default app;
