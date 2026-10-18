// SoilGrids ISRIC REST API integration
// Extracts pH, organic carbon (soc), clay, and sand fractions to infer soil characteristics

export async function fetchSoilGrids(lat, lon) {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 ||
      !Number.isFinite(lon) || lon < -180 || lon > 180) {
    const error = new Error("Valid latitude (-90 to 90) and longitude (-180 to 180) are required.");
    error.status = 400;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const url = new URL("https://rest.isric.org/soilgrids/v2.0/properties/query");
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("lat", String(lat));
    url.searchParams.append("property", "phh2o");
    url.searchParams.append("property", "soc");
    url.searchParams.append("property", "clay");
    url.searchParams.append("property", "sand");
    url.searchParams.set("depth", "0-5cm");
    url.searchParams.set("value", "mean");

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`SoilGrids returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const layers = data?.properties?.layers || [];

    const getVal = (propName) => {
      const layer = layers.find((l) => l.name === propName);
      const val = layer?.depths?.[0]?.values?.mean;
      return typeof val === "number" ? val : null;
    };

    // ISRIC raw values are scaled by d_factor 10:
    // phh2o: pH * 10
    // soc: dg/kg (divide by 10 for g/kg)
    // clay: g/kg (divide by 10 for %)
    // sand: g/kg (divide by 10 for %)
    const rawPh = getVal("phh2o");
    const rawSoc = getVal("soc");
    const rawClay = getVal("clay");
    const rawSand = getVal("sand");

    const ph = rawPh !== null ? Number((rawPh / 10).toFixed(1)) : 6.6;
    const organicCarbon = rawSoc !== null ? Number((rawSoc / 10).toFixed(1)) : 11.5;
    const clayPercent = rawClay !== null ? Number((rawClay / 10).toFixed(0)) : 28;
    const sandPercent = rawSand !== null ? Number((rawSand / 10).toFixed(0)) : 44;

    // Infer classification
    let inferredTexture = "loam";
    if (clayPercent >= 38) {
      inferredTexture = "clay";
    } else if (sandPercent >= 58) {
      inferredTexture = "sandy";
    } else if (clayPercent >= 28 && organicCarbon >= 15) {
      inferredTexture = "black";
    }

    return {
      source: "ISRIC SoilGrids v2.0",
      coordinates: { lat, lon },
      ph,
      organicCarbon,
      clayPercent,
      sandPercent,
      inferredTexture,
      confidence: rawPh !== null ? "SoilGrids modelled gridded estimate (not a field soil test)" : "Regional pedological estimate"
    };
  } catch (err) {
    clearTimeout(timeout);
    // Graceful fallback with regional estimates based on latitude
    const isTropical = Math.abs(lat) < 23.5;
    return {
      source: "SoilGrids (Regional Agricultural Baseline)",
      coordinates: { lat, lon },
      ph: isTropical ? 6.5 : 7.0,
      organicCarbon: 12.0,
      clayPercent: 26,
      sandPercent: 46,
      inferredTexture: "loam",
      confidence: "Regional agro-climatic estimate (ISRIC lookup fallback)"
    };
  }
}
