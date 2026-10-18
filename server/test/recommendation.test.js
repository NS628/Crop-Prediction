import test from "node:test";
import assert from "node:assert/strict";
import { recommendCrops, cropProfiles } from "../src/crops.js";
import { fetchSoilGrids } from "../src/soilgrids.js";
import { fetchCropImage, fetchCropTutorialVideo } from "../src/media.js";

test("Agronomic Recommendation Engine Tests", async (t) => {
  await t.test("Returns 4 shortlisted crops with valid suitability scores", () => {
    const input = { soilType: "loam", season: "monsoon", temperature: 28, ph: 6.5, rainfall: 180 };
    const results = recommendCrops(input);

    assert.equal(results.length, 4, "Should return top 4 recommendations");
    assert.equal(results[0].crop, "Rice", "Rice should rank highest for monsoon/loam/180cm rainfall");
    assert.ok(results[0].score >= 80, "Rice score should be >= 80%");
  });

  await t.test("Every recommended crop provides precision Fertilizer Plan (Urea, DAP, MOP)", () => {
    const input = { soilType: "loam", season: "winter", temperature: 18, ph: 6.8, rainfall: 60 };
    const results = recommendCrops(input);
    const top = results[0];

    assert.ok(top.fertilizerPlan, "Fertilizer plan must be present");
    assert.ok(Number.isFinite(top.fertilizerPlan.ureaKg), "Urea dosage must be a valid number");
    assert.ok(Number.isFinite(top.fertilizerPlan.dapKg), "DAP dosage must be a valid number");
    assert.ok(Number.isFinite(top.fertilizerPlan.mopKg), "MOP dosage must be a valid number");
    assert.ok(top.fertilizerPlan.stages.length >= 2, "Must contain split application stages");
  });

  await t.test("Every recommended crop provides step-by-step Cultivation Schedule", () => {
    const input = { soilType: "clay", season: "monsoon", temperature: 27, ph: 6.2, rainfall: 200 };
    const results = recommendCrops(input);
    const top = results[0];

    assert.ok(Array.isArray(top.cultivationSchedule), "Cultivation schedule must be an array");
    assert.ok(top.cultivationSchedule.length >= 4, "Should have at least 4 growth phases");
    assert.ok(top.cultivationSchedule[0].phase.length > 0, "Phase name must not be empty");
    assert.ok(top.cultivationSchedule[0].period.length > 0, "Phase period must not be empty");
  });

  await t.test("All 8 crops in database contain full agricultural metadata", () => {
    assert.equal(cropProfiles.length, 8, "Expected 8 crop profiles");
    for (const crop of cropProfiles) {
      assert.ok(crop.crop, "Crop must have a name");
      assert.ok(crop.image.startsWith("http"), "Crop must have a valid photography URL");
      assert.ok(crop.fertilizerPlan.ureaKg > 0, `${crop.crop} must have Urea dosing`);
      assert.ok(crop.fertilizerPlan.dapKg > 0, `${crop.crop} must have DAP dosing`);
      assert.ok(crop.fertilizerPlan.mopKg > 0, `${crop.crop} must have MOP dosing`);
      assert.ok(crop.educationalMedia.youtubeId, `${crop.crop} must have YouTube educational ID`);
    }
  });

  await t.test("SoilGrids parser handles coordinates and infers soil texture", async () => {
    const soil = await fetchSoilGrids(12.9165, 79.1325); // Vellore coordinates
    assert.ok(soil.ph >= 0 && soil.ph <= 14, "pH must be in valid 0-14 range");
    assert.ok(Number.isFinite(soil.organicCarbon), "Organic carbon must be finite");
    assert.ok(["loam", "clay", "sandy", "black"].includes(soil.inferredTexture), "Must infer standard soil texture");
  });

  await t.test("External Media services provide robust fallbacks", async () => {
    const img = await fetchCropImage("Wheat", "https://example.com/fallback.jpg");
    assert.ok(img.imageUrl, "Image URL must be returned");

    const vid = await fetchCropTutorialVideo("Wheat", { youtubeId: "uKzB_gR74cQ", title: "Wheat Guide" });
    assert.equal(vid.youtubeId, "uKzB_gR74cQ", "Should return valid YouTube ID");
  });
});
