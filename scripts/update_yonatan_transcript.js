import fs from "fs";
import path from "path";
import JSZip from "jszip";
import sharp from "sharp";

async function generateUpdatedYonatan() {
  const yonatanDocxPath = path.join(process.cwd(), "sample", "Yonatan Transcript.docx");
  const zip = await JSZip.loadAsync(fs.readFileSync(yonatanDocxPath));

  const imgBuf = await zip.file("word/media/image1.jpeg").async("nodebuffer");
  const meta = await sharp(imgBuf).metadata();
  const W = meta.width; // 2338
  const H = meta.height; // 1640

  // Column X-centers for the 12 columns in Yonatan's table:
  // G9: [515, 600, 685], G10: [800, 885, 970], G11: [1085, 1170, 1255], G12: [1370, 1455, 1540]
  const colCenters = [
    515, 600, 685,   // G9: 1st, 2nd, Avg
    800, 885, 970,   // G10: 1st, 2nd, Avg
    1085, 1170, 1255,// G11: 1st, 2nd, Avg
    1370, 1455, 1540 // G12: 1st, 2nd, Avg
  ];

  // Subject rows in Yonatan's exact order:
  const yonatanRows = [
    { subject: "Amharic", g9: ["64.07", "70.18", "67.13"], g10: ["90.99", "95.94", "93.47"], g11: ["67.61", "65.43", "66.52"], g12: ["-", "-", "-"] },
    { subject: "Biology", g9: ["51.53", "65.63", "58.58"], g10: ["82.11", "66.99", "74.55"], g11: ["64.79", "57.64", "61.22"], g12: ["51.89", "56.19", "54.04"] },
    { subject: "Chemistry", g9: ["54.33", "59.26", "56.8"], g10: ["74.56", "82.01", "78.29"], g11: ["59.31", "41.89", "50.6"], g12: ["57.06", "67.01", "62.04"] },
    { subject: "Civics and Ethical Education", g9: ["55.88", "79.55", "67.72"], g10: ["67.43", "90.55", "78.99"], g11: ["71.59", "90.19", "80.89"], g12: ["-", "-", "-"] },
    { subject: "English", g9: ["72.25", "82.89", "77.57"], g10: ["78.8", "83.5", "81.15"], g11: ["58.79", "67.57", "63.18"], g12: ["65.82", "73.22", "69.52"] },
    { subject: "Economics", g9: ["-", "-", "-"], g10: ["-", "-", "-"], g11: ["39.3", "59.06", "49.18"], g12: ["59.31", "54.08", "56.7"] },
    { subject: "General Business", g9: ["-", "-", "-"], g10: ["-", "-", "-"], g11: ["63.17", "79.3", "71.24"], g12: ["-", "-", "-"] },
    { subject: "Geography", g9: ["65.37", "61.84", "63.61"], g10: ["66.88", "72.03", "69.46"], g11: ["35.36", "82.86", "59.11"], g12: ["71.85", "59.91", "65.9"] },
    { subject: "Health and Physical Education", g9: ["99.7", "100", "99.85"], g10: ["99.23", "100", "99.6"], g11: ["100", "100", "100"], g12: ["-", "-", "-"] },
    { subject: "History", g9: ["42.5", "48.37", "45.44"], g10: ["67.33", "60.91", "64.12"], g11: ["38.41", "44.38", "41.4"], g12: ["44.26", "39.24", "41.8"] },
    { subject: "ICT", g9: ["56.28", "55.93", "56.11"], g10: ["88.11", "89.82", "88.97"], g11: ["90.44", "95.14", "92.79"], g12: ["76.84", "77.2", "77.02"] },
    { subject: "Mathematics", g9: ["55.75", "68.75", "62.25"], g10: ["55.86", "68.19", "62.03"], g11: ["62.53", "45.59", "54.06"], g12: ["52.8", "26.08", "39.44"] },
    { subject: "Physics", g9: ["65.09", "55.74", "60.42"], g10: ["67.77", "66.05", "66.9"], g11: ["55.15", "54.61", "54.88"], g12: ["62.5", "54.13", "58.32"] },
    { subject: "Total", g9: ["682.75", "748.14", "715.45"], g10: ["839.07", "875.99", "857.53"], g11: ["704.86", "685.67", "695.27"], g12: ["434.29", "421.64", "427.97"] },
    { subject: "Average", g9: ["62.07", "68.01", "65.04"], g10: ["76.28", "79.64", "77.96"], g11: ["70.49", "68.57", "69.53"], g12: ["62.04", "60.23", "61.14"] },
    { subject: "Rank", g9: ["6/13", "5/13", "7/13"], g10: ["12/23", "9/23", "8/23"], g11: ["5/7", "4/7", "4/7"], g12: ["21/28", "19/28", "20/28"] },
    { subject: "Conduct/Work Ethic", g9: ["", "", ""], g10: ["", "", ""], g11: ["", "A", ""], g12: ["", "F", ""] },
    { subject: "Absences", g9: ["", "", ""], g10: ["", "", ""], g11: ["", "2", ""], g12: ["", "17", ""] },
  ];

  const rowStartY = 485;
  const rowHeight = 44.5;

  let textSvgElements = "";

  yonatanRows.forEach((r, idx) => {
    const yPos = rowStartY + idx * rowHeight;
    const scores = [...r.g9, ...r.g10, ...r.g11, ...r.g12];

    scores.forEach((sc, cIdx) => {
      if (cIdx < colCenters.length && sc !== undefined && sc !== "") {
        const xPos = colCenters[cIdx];
        textSvgElements += `<text x="${xPos}" y="${yPos}" font-family="'Times New Roman', serif" font-size="20" fill="#000000" text-anchor="middle">${sc}</text>`;
      }
    });
  });

  // SVG overlay that blanks only the score numbers and renders Frtuna's values
  const svgOverlay = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Blank the score numbers area inside table cells (x: 468 to 1618, y: 462 to 1270) -->
    <rect x="468" y="462" width="1150" height="810" fill="#ffffff" />
    
    <!-- Table grid lines -->
    ${[738, 1028, 1318].map(x => `<line x1="${x}" y1="462" x2="${x}" y2="1270" stroke="#000000" stroke-width="1.5" />`).join("")}
    ${[555, 642, 842, 928, 1130, 1215, 1415, 1500].map(x => `<line x1="${x}" y1="462" x2="${x}" y2="1270" stroke="#000000" stroke-width="0.8" />`).join("")}
    ${yonatanRows.map((_, i) => `<line x1="468" y1="${rowStartY + i * rowHeight + 10}" x2="1618" y2="${rowStartY + i * rowHeight + 10}" stroke="#000000" stroke-width="0.8" />`).join("")}
    
    <!-- Exact score values -->
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

  const out1 = path.join(process.cwd(), "public", "Updated_Student_Transcript.docx");
  const out2 = path.join(process.cwd(), "public", "Yonatan_Updated_Transcript.docx");
  const preview = path.join(process.cwd(), "public", "Updated_Student_Transcript_Preview.jpg");

  fs.writeFileSync(out1, updatedDocxBuf);
  fs.writeFileSync(out2, updatedDocxBuf);
  fs.writeFileSync(preview, composited);

  console.log("Successfully generated Updated_Student_Transcript.docx!");
}

generateUpdatedYonatan();
