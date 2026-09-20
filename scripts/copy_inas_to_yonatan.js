import fs from "fs";
import path from "path";
import JSZip from "jszip";
import sharp from "sharp";

async function copyInasToYonatan() {
  const yonatanDocxPath = path.join(process.cwd(), "sample", "Yonatan Transcript.docx");
  const zip = await JSZip.loadAsync(fs.readFileSync(yonatanDocxPath));

  const imgBuf = await zip.file("word/media/image1.jpeg").async("nodebuffer");
  const meta = await sharp(imgBuf).metadata();
  const W = meta.width; // 2338
  const H = meta.height; // 1640

  // Column X-centers for the 12 columns in Yonatan's table:
  const colCenters = [
    515, 600, 685,   // G9: 1st, 2nd, Avg
    800, 885, 970,   // G10: 1st, 2nd, Avg
    1085, 1170, 1255,// G11: 1st, 2nd, Avg
    1370, 1455, 1540 // G12: 1st, 2nd, Avg
  ];

  // Subject rows in Yonatan's exact order, with exact scores from Inas Zakir Ahmed's transcript:
  const rows = [
    { subject: "Amharic", scores: ["69.88", "79.22", "74.55", "99.41", "97.86", "98.64", "-", "-", "-", "-", "-", "-"] },
    { subject: "Biology", scores: ["74.33", "79.72", "77.03", "82.92", "83.14", "83.03", "-", "-", "-", "-", "-", "-"] },
    { subject: "Chemistry", scores: ["70", "65.03", "67.52", "92.09", "84.33", "88.21", "86.72", "89.72", "88.22", "83.75", "96", "89.88"] },
    { subject: "Civics and Ethical Education", scores: ["81.76", "86.89", "84.3", "52.99", "76.46", "64.725", "72.39", "88.92", "80.655", "84.29", "97", "90.645"] },
    { subject: "English", scores: ["63.81", "79.54", "71.68", "77.39", "77.67", "77.53", "-", "-", "-", "-", "-", "-"] },
    { subject: "Economics", scores: ["-", "-", "-", "86.16", "84.13", "85.15", "-", "-", "-", "-", "-", "-"] },
    { subject: "General Business", scores: ["-", "-", "-", "-", "-", "-", "63.17", "79.3", "71.24", "-", "-", "-"] },
    { subject: "Geography", scores: ["83.71", "83.2", "83.46", "79.6", "89.69", "84.65", "-", "-", "-", "-", "-", "-"] },
    { subject: "Health and Physical Education", scores: ["100", "100", "100", "81.78", "76.5", "79.14", "82.28", "84.92", "83.6", "89.67", "96.3", "92.985"] },
    { subject: "History", scores: ["75.36", "71.22", "73.3", "83.35", "81.87", "82.61", "-", "-", "-", "-", "-", "-"] },
    { subject: "ICT", scores: ["83.23", "88.07", "85.65", "80.65", "86.15", "83.4", "-", "-", "-", "-", "-", "-"] },
    { subject: "Mathematics", scores: ["72.28", "63.27", "67.78", "84.27", "73.85", "79.06", "97.19", "92.89", "95.04", "93.69", "95", "94.345"] },
    { subject: "Physics", scores: ["72.77", "58.9", "65.84", "62.2", "70.8", "66.5", "68.34", "79.47", "73.905", "78.68", "85", "81.84"] },
    { subject: "Total", scores: ["847.13", "855.06", "851.095", "1034.36", "1061.25", "1047.8", "652.61", "665.46", "659.04", "676.53", "743.5", "710.02"] },
    { subject: "Average", scores: ["77.01", "77.73", "77.37", "79.57", "81.63", "80.60", "81.58", "83.18", "82.38", "84.57", "92.94", "88.75"] },
    { subject: "Rank", scores: ["10/34", "10/34", "9/34", "4/31", "5/31", "4/31", "8/24", "7/24", "8/24", "14/23", "4/23", "4/23"] },
    { subject: "Conduct/Work Ethic", scores: ["A", "", "", "", "", "", "B", "", "", "A", "", ""] },
    { subject: "Absences", scores: ["2", "", "", "", "", "", "5", "", "", "18", "", ""] },
  ];

  const rowStartY = 485;
  const rowHeight = 44.5;

  let textSvgElements = "";

  rows.forEach((r, idx) => {
    const yPos = rowStartY + idx * rowHeight;
    r.scores.forEach((sc, cIdx) => {
      if (cIdx < colCenters.length && sc !== undefined && sc !== "") {
        const xPos = colCenters[cIdx];
        textSvgElements += `<text x="${xPos}" y="${yPos}" font-family="'Times New Roman', serif" font-size="20" fill="#000000" text-anchor="middle">${sc}</text>`;
      }
    });
  });

  // SVG overlay that blanks only the score numbers area and renders Inas's exact numbers
  const svgOverlay = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Blank the score numbers area inside table cells (x: 468 to 1618, y: 462 to 1270) -->
    <rect x="468" y="462" width="1150" height="810" fill="#ffffff" />
    
    <!-- Table grid lines -->
    ${[738, 1028, 1318].map(x => `<line x1="${x}" y1="462" x2="${x}" y2="1270" stroke="#000000" stroke-width="1.5" />`).join("")}
    ${[555, 642, 842, 928, 1130, 1215, 1415, 1500].map(x => `<line x1="${x}" y1="462" x2="${x}" y2="1270" stroke="#000000" stroke-width="0.8" />`).join("")}
    ${rows.map((_, i) => `<line x1="468" y1="${rowStartY + i * rowHeight + 10}" x2="1618" y2="${rowStartY + i * rowHeight + 10}" stroke="#000000" stroke-width="0.8" />`).join("")}
    
    <!-- Exact score values from Inas Zakir Ahmed -->
    ${textSvgElements}
  </svg>`;

  const svgBuf = Buffer.from(svgOverlay);

  const composited = await sharp(imgBuf)
    .composite([{ input: svgBuf, left: 0, top: 0 }])
    .jpeg({ quality: 96 })
    .toBuffer();

  zip.file("word/media/image1.jpeg", composited);

  const updatedDocxBuf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  const out1 = path.join(process.cwd(), "public", "Updated_Yonatan_Transcript.docx");
  const out2 = path.join(process.cwd(), "sample", "Yonatan_Updated_With_Inas.docx");

  fs.writeFileSync(out1, updatedDocxBuf);
  fs.writeFileSync(out2, updatedDocxBuf);

  console.log("Successfully generated:", out1);
}

copyInasToYonatan().catch(err => console.error(err));
