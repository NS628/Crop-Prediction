export const cropProfiles = [
  {
    crop: "Rice",
    category: "Cereal / Staple",
    soils: ["clay", "loam"],
    seasons: ["monsoon"],
    ph: [5.0, 7.0],
    temp: [22, 32],
    rain: [120, 300],
    durationDays: "110 – 140 days",
    expectedYield: "20 – 26 quintals / acre",
    note: "High-affinity staple crop requiring heavy soil water retention and warm temperatures.",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 95,
      dapKg: 50,
      mopKg: 30,
      npkRatio: "120:60:40 kg NPK / ha equivalent",
      organicAlternative: "4–5 tonnes FYM or well-decomposed vermicompost per acre during land preparation.",
      stages: [
        {
          stage: "Basal (At Transplanting)",
          urea: "30 kg/acre (1/3rd dose)",
          dap: "50 kg/acre (100% full dose)",
          mop: "15 kg/acre (50% dose)",
          tips: "Broadcast and incorporate into muddy puddled soil before final leveling."
        },
        {
          stage: "Active Tillering (20–25 DAS)",
          urea: "35 kg/acre (1/3rd dose)",
          dap: "Nil",
          mop: "Nil",
          tips: "Drain excess standing water before top dressing, re-irrigate after 24 hours."
        },
        {
          stage: "Panicle Initiation (45–55 DAS)",
          urea: "30 kg/acre (remaining dose)",
          dap: "Nil",
          mop: "15 kg/acre (remaining 50%)",
          tips: "Crucial for grain filling and panicle count. Ensure adequate soil moisture."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Nursery & Seed Priming",
        period: "Days 1 – 20",
        activities: "Treat seeds with Carbendazim (2g/kg). Maintain 2-3 cm shallow water in nursery bed."
      },
      {
        phase: "Main Field Puddling & Transplanting",
        period: "Days 20 – 28",
        activities: "Puddle soil thoroughly. Transplant 2–3 seedlings per hill at 20x15 cm spacing. Apply basal fertilizers."
      },
      {
        phase: "Tillering & Weed Management",
        period: "Days 28 – 55",
        activities: "Apply early pre-emergence herbicide. Perform first urea top dressing. Maintain 3–5 cm water layer."
      },
      {
        phase: "Panicle Initiation to Flowering",
        period: "Days 55 – 85",
        activities: "Monitor for stem borer and blast. Apply second urea + potash split. Keep soil saturated."
      },
      {
        phase: "Grain Ripening & Harvesting",
        period: "Days 85 – 125",
        activities: "Drain field 10–12 days prior to harvest. Harvest when 85% grains turn golden yellow."
      }
    ],
    educationalMedia: {
      youtubeId: "X4IkJ9DcaIc",
      title: "Paddy/Rice Precision Cultivation & Nutrient Management",
      channel: "ICAR Agricultural Extension"
    }
  },
  {
    crop: "Wheat",
    category: "Cereal / Rabi Staple",
    soils: ["loam", "clay"],
    seasons: ["winter"],
    ph: [6.0, 7.5],
    temp: [10, 25],
    rain: [30, 100],
    durationDays: "115 – 135 days",
    expectedYield: "18 – 22 quintals / acre",
    note: "Prefers well-drained loam soil and cool, bright sunshine during vegetative growth.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 100,
      dapKg: 55,
      mopKg: 25,
      npkRatio: "120:60:40 kg NPK / ha equivalent",
      organicAlternative: "3–4 tonnes FYM + 250 kg Neem Cake per acre to deter termites.",
      stages: [
        {
          stage: "Basal (At Sowing)",
          urea: "35 kg/acre (1/3rd dose)",
          dap: "55 kg/acre (100% full dose)",
          mop: "25 kg/acre (100% full dose)",
          tips: "Place fertilizers 4–5 cm below seed depth using a seed-cum-fertilizer drill."
        },
        {
          stage: "Crown Root Initiation (21–25 DAS)",
          urea: "35 kg/acre (1/3rd dose)",
          dap: "Nil",
          mop: "Nil",
          tips: "Apply just prior to the first crucial CRI irrigation."
        },
        {
          stage: "Jointing Stage (45–50 DAS)",
          urea: "30 kg/acre (final dose)",
          dap: "Nil",
          mop: "Nil",
          tips: "Ensure soil has adequate moisture; avoid application during windy afternoons."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Field Preparation & Seed Treatment",
        period: "Days 1 – 7",
        activities: "Plough 2–3 times to create fine tilth. Treat seed with Vitavax (2.5g/kg). Drill basal fertilizer."
      },
      {
        phase: "Sowing & Germination",
        period: "Days 7 – 20",
        activities: "Sow at 20 cm row spacing, 4–5 cm depth. Ensure adequate residual soil moisture."
      },
      {
        phase: "CRI Stage & First Top Dressing",
        period: "Days 21 – 35",
        activities: "Mandatory first irrigation at Crown Root Initiation (CRI). Apply 1st split of Urea."
      },
      {
        phase: "Tillering, Jointing & Earhead Emergence",
        period: "Days 35 – 75",
        activities: "Second and third irrigations. Apply remaining Urea. Spray zinc sulphate if leaves yellow."
      },
      {
        phase: "Dough Stage to Harvesting",
        period: "Days 75 – 125",
        activities: "Final light irrigation during grain filling. Harvest when moisture drops below 14%."
      }
    ],
    educationalMedia: {
      youtubeId: "uKzB_gR74cQ",
      title: "Wheat Production Technology & Fertilizer Schedule",
      channel: "National Agriculture Portal"
    }
  },
  {
    crop: "Maize",
    category: "Coarse Grain / Feed & Food",
    soils: ["loam", "sandy", "black"],
    seasons: ["summer", "monsoon"],
    ph: [5.5, 7.5],
    temp: [18, 32],
    rain: [50, 150],
    durationDays: "95 – 115 days",
    expectedYield: "24 – 30 quintals / acre",
    note: "Fast-growing high-yield cereal preferring fertile, well-drained loamy soils.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 90,
      dapKg: 45,
      mopKg: 30,
      npkRatio: "120:60:50 kg NPK / ha equivalent",
      organicAlternative: "4 tonnes FYM + Azotobacter bio-fertilizer seed inoculation.",
      stages: [
        {
          stage: "Basal (At Sowing)",
          urea: "25 kg/acre",
          dap: "45 kg/acre (100% full dose)",
          mop: "15 kg/acre (50% dose)",
          tips: "Band place 5 cm away from the seed row to avoid fertilizer burn."
        },
        {
          stage: "Knee-High Stage (30–35 DAS)",
          urea: "40 kg/acre",
          dap: "Nil",
          mop: "15 kg/acre (remaining dose)",
          tips: "Apply along crop ridges followed by earthing-up."
        },
        {
          stage: "Tasseling / Silking Stage (50–55 DAS)",
          urea: "25 kg/acre",
          dap: "Nil",
          mop: "Nil",
          tips: "Crucial flowering stage; ensure no moisture stress."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Land Tilth & Ridge Making",
        period: "Days 1 – 10",
        activities: "Form ridges and furrows at 60 cm intervals. Apply 100% DAP and basal MOP."
      },
      {
        phase: "Sowing & Emergence",
        period: "Days 10 – 20",
        activities: "Dibble seeds at 20 cm plant-to-plant distance on the ridge sides. Pre-emergence herbicide spray."
      },
      {
        phase: "Knee-High Stage & Earthing Up",
        period: "Days 20 – 45",
        activities: "Intercultural weeding, top dress Urea, earthing-up to prevent crop lodging."
      },
      {
        phase: "Tasseling & Silking Stage",
        period: "Days 45 – 70",
        activities: "Critical irrigation window. Scout for Fall Armyworm (FAW) and apply neem oil / emamectin."
      },
      {
        phase: "Cob Maturity & Harvest",
        period: "Days 70 – 105",
        activities: "Cob sheath turns pale brown and grains harden. Harvest and sun-dry cobs."
      }
    ],
    educationalMedia: {
      youtubeId: "nI4zEeqmYyY",
      title: "Scientific Maize Cultivation & High Yield Management",
      channel: "Krishi Vigyan Extension"
    }
  },
  {
    crop: "Groundnut",
    category: "Oilseed / Legume",
    soils: ["sandy", "loam"],
    seasons: ["summer", "monsoon"],
    ph: [5.5, 7.0],
    temp: [20, 30],
    rain: [50, 120],
    durationDays: "105 – 125 days",
    expectedYield: "10 – 14 quintals / acre",
    note: "Leguminous oilseed thriving in friable, loose sandy loam that allows easy peg penetration.",
    image: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 20,
      dapKg: 40,
      mopKg: 30,
      npkRatio: "25:50:40 kg NPK / ha equivalent (Fixes atmospheric N)",
      organicAlternative: "Gypsum 150 kg/acre at 40 DAS is critical for pod filling and oil synthesis.",
      stages: [
        {
          stage: "Basal (At Sowing)",
          urea: "20 kg/acre (full starter N)",
          dap: "40 kg/acre (100% full dose)",
          mop: "30 kg/acre (100% full dose)",
          tips: "Apply alongside Trichoderma viride enriched farmyard manure."
        },
        {
          stage: "Pegging Stage (40–45 DAS)",
          urea: "Nil (Rhizobium nodules fix nitrogen)",
          dap: "Nil",
          mop: "Nil",
          tips: "Top-dress 150 kg/acre Gypsum around root zones and perform light hoeing."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Field Preparation & Seed Inoculation",
        period: "Days 1 – 10",
        activities: "Bring soil to fine tilth. Treat pods/kernels with Rhizobium culture & Trichoderma."
      },
      {
        phase: "Sowing & Early Stand",
        period: "Days 10 – 25",
        activities: "Sow at 30x10 cm spacing. Ensure light sprinkler or furrow irrigation."
      },
      {
        phase: "Flowering & Peg Initiation",
        period: "Days 25 – 45",
        activities: "Pegs begin penetrating the soil. Avoid deep hoeing now. Apply gypsum for calcium uptake."
      },
      {
        phase: "Pod Development Stage",
        period: "Days 45 – 85",
        activities: "Maintain adequate soil moisture so pods can swell smoothly without soil hardening."
      },
      {
        phase: "Maturity & Pulling",
        period: "Days 85 – 115",
        activities: "Test mature pods (inside shell turns black/brown). Pull plants, pod strip, and cure in sun."
      }
    ],
    educationalMedia: {
      youtubeId: "tGZ08c1C9i0",
      title: "Groundnut / Peanut Farming Technology & Gypsum Management",
      channel: "Precision Agriculture India"
    }
  },
  {
    crop: "Cotton",
    category: "Commercial / Fiber Crop",
    soils: ["black", "loam"],
    seasons: ["summer", "monsoon"],
    ph: [5.8, 8.0],
    temp: [21, 35],
    rain: [50, 120],
    durationDays: "150 – 180 days",
    expectedYield: "8 – 12 quintals / acre (seed cotton)",
    note: "Long-duration fiber crop performing best in deep black cotton soils with good drainage.",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 85,
      dapKg: 45,
      mopKg: 35,
      npkRatio: "100:50:50 kg NPK / ha equivalent",
      organicAlternative: "5 tonnes FYM + 2 kg/acre Bio-potash solubilizers.",
      stages: [
        {
          stage: "Basal (At Sowing)",
          urea: "20 kg/acre",
          dap: "45 kg/acre (100% full dose)",
          mop: "15 kg/acre",
          tips: "Incorporate into ridges 5 cm below seed depth."
        },
        {
          stage: "Square Formation (40–45 DAS)",
          urea: "35 kg/acre",
          dap: "Nil",
          mop: "10 kg/acre",
          tips: "Apply in ring method around plant base during hoeing."
        },
        {
          stage: "Peak Flowering / Boll Formation (70–75 DAS)",
          urea: "30 kg/acre",
          dap: "Nil",
          mop: "10 kg/acre",
          tips: "Foliar spray with 2% DAP or Potassium Nitrate for boll weight retention."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Deep Ploughing & Ridging",
        period: "Days 1 – 15",
        activities: "Deep subsoiling to break hardpan. Make ridges at 90 cm distance. Apply basal nutrition."
      },
      {
        phase: "Dibbling & Germination",
        period: "Days 15 – 30",
        activities: "Dibble hybrid seeds at 90x45 or 90x60 cm. Gap fill within 7 days."
      },
      {
        phase: "Square Formation & Inter-culture",
        period: "Days 30 – 60",
        activities: "Keep field weed-free. Install yellow sticky traps and pheromone traps for bollworms."
      },
      {
        phase: "Boll Development & Canopy Management",
        period: "Days 60 – 110",
        activities: "Monitor sucking pests (thrips/aphids). Detop main shoot at 80–90 days if overgrown."
      },
      {
        phase: "Boll Bursting & Multi-stage Picking",
        period: "Days 110 – 165",
        activities: "Pick clean seed cotton in dry morning hours. Store in dry, clean cloth bags."
      }
    ],
    educationalMedia: {
      youtubeId: "Vj_hHqK5fS8",
      title: "Cotton Agronomy, Pest Management & High Yield Practices",
      channel: "Agri Crop Extension"
    }
  },
  {
    crop: "Millet",
    category: "Nutri-Cereal / Climate Resilient",
    soils: ["sandy", "loam"],
    seasons: ["summer", "monsoon"],
    ph: [5.5, 7.8],
    temp: [25, 38],
    rain: [20, 90],
    durationDays: "75 – 90 days",
    expectedYield: "12 – 16 quintals / acre",
    note: "Extremely drought-tolerant nutri-cereal suitable for low-fertility soils and dryland farming.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 40,
      dapKg: 30,
      mopKg: 18,
      npkRatio: "60:30:30 kg NPK / ha equivalent",
      organicAlternative: "2–3 tonnes vermicompost per acre.",
      stages: [
        {
          stage: "Basal (At Sowing)",
          urea: "20 kg/acre (50% dose)",
          dap: "30 kg/acre (100% full dose)",
          mop: "18 kg/acre (100% full dose)",
          tips: "Broadcast and mix during last ploughing."
        },
        {
          stage: "Tillering Stage (25–30 DAS)",
          urea: "20 kg/acre (remaining dose)",
          dap: "Nil",
          mop: "Nil",
          tips: "Top-dress during intercultural weeding when soil is moist."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Land Preparation",
        period: "Days 1 – 7",
        activities: "Shallow ploughing and firm seedbed preparation. Drill basal fertilizer."
      },
      {
        phase: "Direct Sowing & Thinning",
        period: "Days 7 – 20",
        activities: "Sow at 45x15 cm spacing. Thin out excess seedlings at 15 days to ensure healthy stand."
      },
      {
        phase: "Tillering & Inter-cultivation",
        period: "Days 20 – 40",
        activities: "Hoeing between rows, second dose of Urea. Very low irrigation requirement."
      },
      {
        phase: "Flowering & Grain Filling",
        period: "Days 40 – 65",
        activities: "Single protective irrigation if prolonged drought occurs during earhead emergence."
      },
      {
        phase: "Maturity & Earhead Harvest",
        period: "Days 65 – 85",
        activities: "Cut earheads when grains are dry and hard. Thresh and sun-dry."
      }
    ],
    educationalMedia: {
      youtubeId: "t3mFj8qD9Yk",
      title: "Pearl Millet (Bajra) Modern Cultivation Techniques",
      channel: "Millet Mission Hub"
    }
  },
  {
    crop: "Sugarcane",
    category: "Commercial / High Value Cash Crop",
    soils: ["loam", "clay", "black"],
    seasons: ["summer", "monsoon"],
    ph: [5.5, 8.0],
    temp: [20, 35],
    rain: [100, 250],
    durationDays: "300 – 360 days",
    expectedYield: "40 – 50 tonnes / acre",
    note: "Heavy feeder crop requiring assured irrigation and rich, loamy organic soil.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 160,
      dapKg: 75,
      mopKg: 65,
      npkRatio: "250:100:120 kg NPK / ha equivalent",
      organicAlternative: "8–10 tonnes press mud or composted sugarcane bagasse per acre.",
      stages: [
        {
          stage: "Basal (At Sett Planting)",
          urea: "30 kg/acre",
          dap: "75 kg/acre (100% full dose)",
          mop: "30 kg/acre",
          tips: "Apply in open furrows before placing cane setts."
        },
        {
          stage: "Tillering Phase (45 DAS)",
          urea: "50 kg/acre",
          dap: "Nil",
          mop: "15 kg/acre",
          tips: "Apply in furrow sides and cover with soil."
        },
        {
          stage: "Grand Growth Stage (90–120 DAS)",
          urea: "80 kg/acre",
          dap: "Nil",
          mop: "20 kg/acre",
          tips: "Complete before final earthing up. Critical for cane girth and height."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Deep Furrowing & Sett Selection",
        period: "Days 1 – 15",
        activities: "Open deep trenches at 90–120 cm. Select disease-free two/three budded setts."
      },
      {
        phase: "Planting & Sprouting",
        period: "Days 15 – 45",
        activities: "Sett treatment with Carbendazim. Place setts end-to-end, cover with 5 cm soil and irrigate."
      },
      {
        phase: "Tillering & Early Earthing Up",
        period: "Days 45 – 90",
        activities: "Hoeing, weed control, shoot borer control using Trichogramma cards. First split Urea."
      },
      {
        phase: "Grand Growth & Final Earthing Up",
        period: "Days 90 – 180",
        activities: "Heavy earthing up to prevent lodging. Propping/tying clumps together. Drip fertigation."
      },
      {
        phase: "Ripening & Harvesting",
        period: "Days 180 – 340",
        activities: "Withhold irrigation 15 days before harvest. Cut stalks close to ground level."
      }
    ],
    educationalMedia: {
      youtubeId: "R8yZf5Zl4qY",
      title: "Sugarcane Drip Irrigation & High-Yield Fertigation Guide",
      channel: "Cane Research Station"
    }
  },
  {
    crop: "Soybean",
    category: "Oilseed & Pulse",
    soils: ["loam", "black"],
    seasons: ["monsoon"],
    ph: [6.0, 7.5],
    temp: [20, 30],
    rain: [60, 150],
    durationDays: "90 – 110 days",
    expectedYield: "10 – 13 quintals / acre",
    note: "High-protein legume thriving in fertile black cotton and loamy soils with good drainage.",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=80",
    fertilizerPlan: {
      ureaKg: 25,
      dapKg: 50,
      mopKg: 25,
      npkRatio: "30:60:40 kg NPK / ha equivalent",
      organicAlternative: "Rhizobium japonicum + PSB (Phosphate Solubilizing Bacteria) seed inoculation.",
      stages: [
        {
          stage: "Basal (At Sowing)",
          urea: "25 kg/acre (Starter nitrogen)",
          dap: "50 kg/acre (100% full dose)",
          mop: "25 kg/acre (100% full dose)",
          tips: "Drill basal nutrients 5 cm deeper and to the side of seeds."
        },
        {
          stage: "Pod Initiation Stage (45–50 DAS)",
          urea: "Nil (Biological N fixation active)",
          dap: "Nil",
          mop: "Nil",
          tips: "Foliar spray with 2% 19:19:19 soluble fertilizer or micronutrient mix for pod filling."
        }
      ]
    },
    cultivationSchedule: [
      {
        phase: "Land Tilth & Inoculation",
        period: "Days 1 – 7",
        activities: "Bring soil to fine crumble. Inoculate certified seeds with Rhizobium culture in shade."
      },
      {
        phase: "Sowing & Plant Stand",
        period: "Days 7 – 20",
        activities: "Sow at 45x5 cm spacing using seed drill. Ensure 3 cm sowing depth to prevent crusting."
      },
      {
        phase: "Weed Control & Vegetative Stage",
        period: "Days 20 – 40",
        activities: "Perform one hand weeding at 20–25 DAS or spray post-emergence weedicide."
      },
      {
        phase: "Flowering & Pod Setting",
        period: "Days 40 – 70",
        activities: "Maintain moisture at pod development. Scout for girdle beetle and spodoptera."
      },
      {
        phase: "Leaf Shedding & Harvest",
        period: "Days 70 – 100",
        activities: "Harvest when leaves turn yellow and drop, and pods rattle when shaken."
      }
    ],
    educationalMedia: {
      youtubeId: "wLgV5oZ2_gQ",
      title: "Soybean Scientific Package of Practices & Yield Boost",
      channel: "National Oilseeds Directorate"
    }
  }
];

function rangeScore(value, range) {
  const [min, max] = range;
  if (value >= min && value <= max) return 1;
  const distance = value < min ? min - value : value - max;
  return Math.max(0, 1 - distance / Math.max(max - min, 1));
}

export function recommendCrops(input) {
  return cropProfiles.map((p) => {
    const checks = [
      {
        label: "Soil texture match",
        score: p.soils.includes(input.soilType) ? 1 : 0.35,
        detail: p.soils.includes(input.soilType)
          ? `Your selected ${input.soilType} soil is optimal for ${p.crop}.`
          : `This crop is more commonly suited to ${p.soils.join(" or ")} soil.`
      },
      {
        label: "Growing season match",
        score: p.seasons.includes(input.season) ? 1 : 0.35,
        detail: p.seasons.includes(input.season)
          ? `The ${input.season} season matches the primary agro-climatic window for ${p.crop}.`
          : `The ${input.season} season is not the ideal commercial window for ${p.crop}.`
      },
      {
        label: "Soil pH suitability",
        score: rangeScore(input.ph, p.ph),
        detail: `Field pH (${input.ph}) vs optimal reference: ${p.ph[0]}–${p.ph[1]}.`
      },
      {
        label: "Temperature suitability",
        score: rangeScore(input.temperature, p.temp),
        detail: `Field temp (${input.temperature}°C) vs optimal reference: ${p.temp[0]}–${p.temp[1]}°C.`
      },
      {
        label: "Seasonal rainfall match",
        score: rangeScore(input.rainfall, p.rain),
        detail: `Rainfall estimate (${input.rainfall} cm) vs crop requirement: ${p.rain[0]}–${p.rain[1]} cm.`
      }
    ];

    const score = Math.round((checks.reduce((sum, c) => sum + c.score, 0) / checks.length) * 100);

    return {
      crop: p.crop,
      category: p.category,
      score,
      durationDays: p.durationDays,
      expectedYield: p.expectedYield,
      note: p.note,
      image: p.image,
      checks,
      fertilizerPlan: p.fertilizerPlan,
      cultivationSchedule: p.cultivationSchedule,
      educationalMedia: p.educationalMedia
    };
  }).sort((a, b) => b.score - a.score).slice(0, 4);
}
