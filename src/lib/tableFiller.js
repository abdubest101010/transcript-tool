import JSZip from "jszip";
import sharp from "sharp";

export const DEFAULT_TRANSCRIPT_SUBJECTS = [
  { subject: "Agriculture", g9: ["-", "-", "-"], g10: ["-", "-", "-"], g11: ["92.8", "85.66", "89.23"], g12: ["85.86", "95.2", "90.53"] },
  { subject: "Afan Oromo", g9: ["-", "-", "-"], g10: ["99.41", "97.86", "98.64"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Amharic", g9: ["69.88", "79.22", "74.55"], g10: ["82.92", "83.14", "83.03"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Biology", g9: ["74.33", "79.72", "77.03"], g10: ["92.09", "84.33", "88.21"], g11: ["86.72", "89.72", "88.22"], g12: ["83.75", "96", "89.88"] },
  { subject: "Chemistry", g9: ["70", "65.03", "67.52"], g10: ["52.99", "76.46", "64.725"], g11: ["72.39", "88.92", "80.655"], g12: ["84.29", "97", "90.645"] },
  { subject: "Civics and Ethical Education", g9: ["81.76", "86.89", "84.3"], g10: ["86.16", "84.13", "85.15"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Economics", g9: ["-", "-", "-"], g10: ["77.39", "77.67", "77.53"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "English", g9: ["63.81", "79.54", "71.68"], g10: ["81.78", "76.5", "79.14"], g11: ["82.28", "84.92", "83.6"], g12: ["89.67", "96.3", "92.985"] },
  { subject: "Health and Physical Education", g9: ["100", "100", "100"], g10: ["79.6", "89.69", "84.65"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "Geography", g9: ["83.71", "83.2", "83.46"], g10: ["83.35", "81.87", "82.61"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "History", g9: ["75.36", "71.22", "73.3"], g10: ["80.65", "86.15", "83.4"], g11: ["-", "-", "-"], g12: ["-", "-", "-"] },
  { subject: "ICT", g9: ["83.23", "88.07", "85.65"], g10: ["84.27", "73.85", "79.06"], g11: ["97.19", "92.89", "95.04"], g12: ["93.69", "95", "94.345"] },
  { subject: "Mathematics", g9: ["72.28", "63.27", "67.78"], g10: ["62.2", "70.8", "66.5"], g11: ["68.34", "79.47", "73.905"], g12: ["88.68", "85", "86.84"] },
  { subject: "Physics", g9: ["72.77", "58.9", "65.84"], g10: ["71.55", "78.8", "75.18"], g11: ["74.74", "65.47", "70.105"], g12: ["89.98", "89", "89.49"] },
  { subject: "Web Design & Development", g9: ["-", "-", "-"], g10: ["-", "-", "-"], g11: ["78.15", "78.41", "78.28"], g12: ["88.48", "90.0", "89.24"] },
  { subject: "Total", g9: ["847.13", "855.06", "851.095"], g10: ["1034.36", "1061.25", "1047.8"], g11: ["652.61", "665.46", "659.04"], g12: ["704.4", "743.5", "723.95"] },
  { subject: "Average", g9: ["77.01", "77.73", "77.37"], g10: ["79.57", "81.63", "80.60"], g11: ["81.58", "83.18", "82.38"], g12: ["88.05", "92.94", "90.49"] },
  { subject: "Rank", g9: ["10/34", "10/34", "9/34"], g10: ["4/31", "5/31", "4/31"], g11: ["8/24", "7/24", "8/24"], g12: ["14/23", "4/23", "4/23"] },
  { subject: "Conduct/Work Ethic", g9: ["", "A", ""], g10: ["", "A", ""], g11: ["", "B", ""], g12: ["", "A", ""] },
  { subject: "Absences", g9: ["", "2", ""], g10: ["", "8", ""], g11: ["", "5", ""], g12: ["", "18", ""] },
];

function normalizeStr(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Replaces text runs <w:t> in XML cell
 */
function replaceCellText(tcXml, newText) {
  if (/<w:t[\s\S]*?<\/w:t>/.test(tcXml)) {
    let replaced = false;
    return tcXml.replace(/<w:t([^>]*)>([\s\S]*?)<\/w:t>/g, (m, attrs, content) => {
      if (!replaced) {
        replaced = true;
        return `<w:t${attrs}>${newText}</w:t>`;
      }
      return `<w:t${attrs}></w:t>`;
    });
  }
  if (/<w:p[\s\S]*?<\/w:p>/.test(tcXml)) {
    return tcXml.replace(/(<w:pPr[\s\S]*?<\/w:pPr>)/, `$1<w:r><w:t>${newText}</w:t></w:r>`);
  }
  return tcXml;
}

/**
 * Composites new table scores over an image-based scanned transcript DOCX (like Frtuna).
 */
async function updateImageBasedDocx(zip, targetImageItem, gradesList) {
  const imgBuf = await targetImageItem.file.async("nodebuffer");
  const meta = await sharp(imgBuf).metadata();
  const W = meta.width; // 2338
  const H = meta.height; // 1654

  // Table coordinates on Gibson scanned document:
  // Data rows begin at y ~535, row height ~44px, total ~20 rows
  // Column centers for the 12 score columns:
  // G9: [515, 595, 675], G10: [780, 860, 940], G11: [1040, 1120, 1200], G12: [1300, 1380, 1460]
  const colCenters = [
    515, 595, 675,   // G9: 1st, 2nd, Avg
    780, 860, 940,   // G10: 1st, 2nd, Avg
    1040, 1120, 1200,// G11: 1st, 2nd, Avg
    1300, 1380, 1460 // G12: 1st, 2nd, Avg
  ];

  const rowStartY = 538;
  const rowHeight = 44.5;

  let textSvgElements = "";

  gradesList.forEach((r, idx) => {
    const yPos = rowStartY + idx * rowHeight;
    let scores = [];
    if (r.g9 && r.g10 && r.g11 && r.g12) {
      scores = [...r.g9, ...r.g10, ...r.g11, ...r.g12];
    } else if (Array.isArray(r.scores)) {
      scores = r.scores;
    }

    scores.forEach((sc, cIdx) => {
      if (cIdx < colCenters.length && sc !== undefined && sc !== "") {
        const xPos = colCenters[cIdx];
        textSvgElements += `<text x="${xPos}" y="${yPos}" font-family="'Times New Roman', serif" font-size="20" fill="#000000" text-anchor="middle">${sc}</text>`;
      }
    });
  });

  // SVG overlay that blanks the score columns and writes the new numbers
  const svgOverlay = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Blank out the score data cell areas (x: 475 to 1515, y: 515 to 1445) -->
    <rect x="475" y="515" width="1040" height="930" fill="#ffffff" />
    <!-- Draw vertical and horizontal grid lines inside table -->
    ${colCenters.map((x) => `<line x1="${x + 40}" y1="515" x2="${x + 40}" y2="1445" stroke="#000000" stroke-width="1" />`).join("")}
    ${gradesList.map((_, i) => `<line x1="475" y1="${rowStartY + i * rowHeight + 10}" x2="1515" y2="${rowStartY + i * rowHeight + 10}" stroke="#000000" stroke-width="1" />`).join("")}
    <!-- Render text numbers -->
    ${textSvgElements}
  </svg>`;

  const svgBuf = Buffer.from(svgOverlay);

  const composited = await sharp(imgBuf)
    .composite([{ input: svgBuf, left: 0, top: 0 }])
    .jpeg({ quality: 96 })
    .toBuffer();

  zip.file(targetImageItem.path, composited);

  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}

/**
 * Injects results into Word DOCX (handles both XML tables and Scanned Page images).
 */
export async function injectResultsIntoDocx(targetDocxBuffer, sourceGrades = []) {
  const zip = await JSZip.loadAsync(targetDocxBuffer);

  // Check if it's an image-based scanned page DOCX (e.g. Frtuna Transcript)
  const mediaFiles = [];
  zip.folder("word/media")?.forEach((relativePath, file) => {
    mediaFiles.push({ path: `word/media/${relativePath}`, file });
  });

  const largeScannedImage = mediaFiles.find((m) => {
    const low = m.path.toLowerCase();
    return low.endsWith(".jpeg") || low.endsWith(".jpg") || low.endsWith(".png");
  });

  const docPath = "word/document.xml";
  let docXml = (await zip.file(docPath)?.async("text")) || "";

  const hasNativeTable = docXml.includes("<w:tbl") && docXml.includes("Subject");

  if (!hasNativeTable && largeScannedImage) {
    // Format 1: Image-based scanned document
    return await updateImageBasedDocx(zip, largeScannedImage, sourceGrades.length > 0 ? sourceGrades : DEFAULT_TRANSCRIPT_SUBJECTS);
  }

  // Format 2: Native Word XML table
  const tblRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;

  docXml = docXml.replace(tblRegex, (tblXml) => {
    if (!tblXml.includes("Subject")) return tblXml;

    const trRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
    const rows = tblXml.match(trRegex) || [];
    if (rows.length <= 2) return tblXml;

    const headerRows = rows.slice(0, 2);
    const dataRows = rows.slice(2);

    const updatedDataRows = dataRows.map((rowXml, rowIndex) => {
      const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
      const cells = rowXml.match(tcRegex) || [];
      if (cells.length === 0) return rowXml;

      const subjTexts = (cells[0].match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map((t) =>
        t.replace(/<.*?>/g, "")
      );
      const rowSubject = subjTexts.join("").trim();
      const normTargetSubj = normalizeStr(rowSubject);

      let matchedSource = sourceGrades.find(
        (sg) => normalizeStr(sg.subject) === normTargetSubj
      );
      if (!matchedSource && sourceGrades[rowIndex]) {
        matchedSource = sourceGrades[rowIndex];
      }
      if (!matchedSource) return rowXml;

      let sourceScores = [];
      if (matchedSource.g9 && matchedSource.g10 && matchedSource.g11 && matchedSource.g12) {
        sourceScores = [...matchedSource.g9, ...matchedSource.g10, ...matchedSource.g11, ...matchedSource.g12];
      } else if (Array.isArray(matchedSource.scores)) {
        sourceScores = matchedSource.scores;
      }

      let cellIndex = 0;
      return rowXml.replace(tcRegex, (tcXmlContent) => {
        if (cellIndex === 0) {
          cellIndex++;
          return tcXmlContent;
        }
        const scoreIdx = cellIndex - 1;
        cellIndex++;
        if (scoreIdx < sourceScores.length) {
          const val = sourceScores[scoreIdx] !== undefined ? String(sourceScores[scoreIdx]) : "";
          return replaceCellText(tcXmlContent, val);
        }
        return tcXmlContent;
      });
    });

    const headerXml = tblXml.substring(0, tblXml.indexOf(rows[0]));
    const footerXml = tblXml.substring(tblXml.lastIndexOf("</w:tr>") + 7);
    return headerXml + headerRows.join("") + updatedDataRows.join("") + footerXml;
  });

  zip.file(docPath, docXml);

  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}
