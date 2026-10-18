import { jsPDF } from "jspdf";

export function downloadPredictionReport(result, locationInfo = null) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const left = 16;
  const contentWidth = 178;
  let y = 16;

  // Header Banner
  doc.setFillColor(34, 76, 56); // Deep forest green
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("SMART CROP PREDICTION & PRECISION AGRI-REPORT", left, 12);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Cloud-Based Precision Agriculture Platform · CSI3001 Cloud Computing Methodologies, VIT Vellore", left, 18);
  doc.text("Student: Neha Sudhan (24MID0326) · Faculty: Dr. Kakelli Anil Kumar", left, 23);

  // Metadata Bar
  y = 36;
  doc.setFillColor(245, 247, 244);
  doc.rect(left, y, contentWidth, 14, "F");
  doc.setDrawColor(210, 220, 212);
  doc.rect(left, y, contentWidth, 14, "S");

  doc.setTextColor(50, 60, 55);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(`Generated: ${new Date(result.generatedAt || Date.now()).toLocaleString()}`, left + 4, y + 5);
  doc.text(`Location Context: ${locationInfo?.location?.displayName || locationInfo?.displayName || "Manual Input Snapshot"}`, left + 4, y + 10);
  doc.text(`Method: ${result.method || "Cloud Recommendation Engine"}`, left + 100, y + 5);
  y += 20;

  // Section 1: Field Parameters Snapshot
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 76, 56);
  doc.text("1. FIELD ATTRIBUTES & PEDOLOGICAL PROFILE", left, y);
  y += 5;

  const params = [
    `Soil Texture: ${result.input.soilType.toUpperCase()}`,
    `Growing Season: ${result.input.season.toUpperCase()}`,
    `Temperature: ${result.input.temperature} °C`,
    `Soil Reaction: ${result.input.ph} pH`,
    `Seasonal Rainfall: ${result.input.rainfall} cm`
  ];

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 45, 40);

  // Two column layout for parameters
  doc.text(params.slice(0, 3).join("   |   "), left + 2, y + 2);
  doc.text(params.slice(3).join("   |   "), left + 2, y + 7);
  y += 14;

  // Section 2: Crop Suitability Rankings
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 76, 56);
  doc.text("2. CROP SUITABILITY SHORTLIST & AGRONOMIC MATCH", left, y);
  y += 6;

  for (const [index, crop] of (result.recommendations || []).entries()) {
    const isTop = index === 0;
    doc.setFillColor(isTop ? 238 : 248, isTop ? 245 : 249, isTop ? 240 : 248);
    doc.rect(left, y, contentWidth, 13, "F");
    doc.setDrawColor(220, 228, 220);
    doc.rect(left, y, contentWidth, 13, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(isTop ? 25 : 55, isTop ? 80 : 65, isTop ? 50 : 55);
    doc.text(`#${index + 1}  ${crop.crop} (${crop.category || "Cereal / Field Crop"})`, left + 4, y + 5.5);

    doc.setFont("helvetica", "bold");
    doc.text(`Suitability Score: ${crop.score}/100`, left + 125, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 75, 70);
    doc.text(`Duration: ${crop.durationDays || "N/A"}  |  Expected Yield: ${crop.expectedYield || "N/A"}`, left + 4, y + 9.5);

    y += 15;
  }

  const topCrop = result.recommendations?.[0];

  // Section 3: Fertilizer Application Plan (Urea, DAP, MOP)
  if (topCrop?.fertilizerPlan) {
    y += 3;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 76, 56);
    doc.text(`3. PRECISION FERTILIZER PLAN FOR ${topCrop.crop.toUpperCase()} (UREA, DAP, MOP)`, left, y);
    y += 5;

    // Metric Summary Boxes
    const plan = topCrop.fertilizerPlan;
    const boxWidth = 56;
    const boxHeight = 14;

    const ferts = [
      { name: "UREA (Nitrogen - N)", qty: `${plan.ureaKg} kg / acre`, col: [230, 245, 255] },
      { name: "DAP (Phosphorus - P)", qty: `${plan.dapKg} kg / acre`, col: [235, 250, 235] },
      { name: "MOP (Potassium - K)", qty: `${plan.mopKg} kg / acre`, col: [255, 245, 230] }
    ];

    ferts.forEach((f, idx) => {
      const bx = left + idx * (boxWidth + 5);
      doc.setFillColor(f.col[0], f.col[1], f.col[2]);
      doc.rect(bx, y, boxWidth, boxHeight, "F");
      doc.setDrawColor(200, 210, 205);
      doc.rect(bx, y, boxWidth, boxHeight, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(40, 50, 45);
      doc.text(f.name, bx + 3, y + 4.5);

      doc.setFontSize(10);
      doc.setTextColor(20, 60, 40);
      doc.text(f.qty, bx + 3, y + 10.5);
    });

    y += boxHeight + 4;

    // NPK and Organic advice
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 65, 60);
    doc.text(`Nutrient Target: ${plan.npkRatio || "Balanced NPK"}`, left + 2, y);
    y += 4;
    doc.text(`Organic Alternative: ${plan.organicAlternative || "Well-decomposed FYM/compost"}`, left + 2, y);
    y += 6;

    // Stage by Stage Application Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(34, 76, 56);
    doc.text("Fertilizer Split Application Schedule:", left + 2, y);
    y += 4;

    for (const stage of plan.stages || []) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(40, 50, 40);
      doc.text(`• ${stage.stage}:`, left + 4, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Urea: ${stage.urea} | DAP: ${stage.dap} | MOP: ${stage.mop}`, left + 50, y);
      y += 4;
      doc.setFontSize(7.5);
      doc.setTextColor(90, 95, 90);
      doc.text(`  Note: ${stage.tips}`, left + 6, y);
      y += 4.5;
    }
  }

  // Check if we need Page 2 for Cultivation Schedule
  if (y > 215 || topCrop?.cultivationSchedule) {
    doc.addPage();
    y = 20;

    // Page 2 header
    doc.setFillColor(34, 76, 56);
    doc.rect(0, 0, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`FIELDWISE PRECISION AGRI-REPORT · CULTIVATION SCHEDULE FOR ${topCrop.crop.toUpperCase()}`, left, 8);

    y = 22;
  }

  // Section 4: Step-by-Step Cultivation Schedule
  if (topCrop?.cultivationSchedule) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 76, 56);
    doc.text(`4. STEP-BY-STEP CULTIVATION SCHEDULE (${topCrop.durationDays || "Full Season"})`, left, y);
    y += 6;

    for (const step of topCrop.cultivationSchedule) {
      doc.setFillColor(247, 249, 246);
      doc.rect(left, y, contentWidth, 14, "F");
      doc.setDrawColor(220, 226, 220);
      doc.rect(left, y, contentWidth, 14, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(25, 75, 50);
      doc.text(step.phase, left + 4, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(90, 80, 40);
      doc.text(`[${step.period}]`, left + 130, y + 4.5);

      doc.setFontSize(7.5);
      doc.setTextColor(50, 55, 50);
      const lines = doc.splitTextToSize(step.activities, 168);
      doc.text(lines, left + 4, y + 9);

      y += 16;
    }
  }

  // Educational video & External Services Note
  y += 4;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 76, 56);
  doc.text("Integrated Cloud Services & Educational Extension:", left, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 85, 80);
  doc.text("• Meteorological Service: OpenWeatherMap API | Soil Analytics: ISRIC SoilGrids v2.0 REST API", left, y);
  y += 3.5;
  doc.text("• Geolocation: OpenStreetMap Nominatim API | Visual Assets: Unsplash/Pexels API | Video: YouTube Data API v3", left, y);
  y += 3.5;
  doc.text(`• Recommended Tutorial Video: "${topCrop?.educationalMedia?.title || "Cultivation Guide"}" (${topCrop?.educationalMedia?.channel || "Agri Extension"})`, left, y);
  y += 7;

  // Academic Disclaimer
  doc.setDrawColor(210, 215, 210);
  doc.line(left, y, left + contentWidth, y);
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(120, 125, 120);
  doc.text("Educational Prototype for CSI3001 Cloud Computing Methodologies, VIT Vellore. Submitted by Neha Sudhan (24MID0326).", left, y);
  doc.text("Validate soil recommendations with local district Krishi Vigyan Kendra (KVK) before field deployment.", left, y + 3.5);

  doc.save(`fieldwise-${topCrop?.crop?.toLowerCase() || "crop"}-suitability-report.pdf`);
}
