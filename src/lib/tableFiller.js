import JSZip from "jszip";
import sharp from "sharp";
import { createWorker } from "tesseract.js";

/**
 * Standard list of transcript subjects for normalization and fuzzy matching
 */
const KNOWN_SUBJECTS = [
  "Agriculture",
  "Afan Oromo",
  "Amharic",
  "Biology",
  "Chemistry",
  "Civics and Ethical Education",
  "Civics",
  "Economics",
  "English",
  "Health and Physical Education",
  "Physical Education",
  "Geography",
  "History",
  "ICT",
  "Information Technology",
  "Information and Communication Technology",
  "Mathematics",
  "Maths",
  "Physics",
  "Web Design & Development",
  "Web Design",
  "Total",
  "Average",
  "Rank",
  "Conduct/Work Ethic",
  "Conduct",
  "Absences",
];

function normalizeStr(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Extracts raw lines from an image using OCR (Tesseract.js).
 */
export async function extractTableFromImageBuffer(imageBuffer) {
  try {
    // Preprocess image with Sharp for optimal OCR accuracy (grayscale, normalize, threshold)
    const preprocessed = await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();

    const worker = await createWorker("eng");
    const ret = await worker.recognize(preprocessed);
    await worker.terminate();

    const text = ret.data.text || "";
    return parseTextIntoGradeRows(text);
  } catch (err) {
    console.warn("Error running OCR on image:", err.message);
    return [];
  }
}

/**
 * Parses OCR / document text lines into structured subject + scores list.
 */
export function parseTextIntoGradeRows(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const resultRows = [];

  for (const line of lines) {
    // Check if line begins with or contains a known subject
    for (const subj of KNOWN_SUBJECTS) {
      const normSubj = normalizeStr(subj);
      const normLine = normalizeStr(line);

      if (normLine.includes(normSubj) || line.toLowerCase().startsWith(subj.toLowerCase())) {
        // Extract all score tokens: numbers, decimals, dashes, ranks like 10/34, letters like A, B, C
        const tokens = line.match(/(\d+\.?\d*|\-|\/|[A-F]|\d+\/\d+)/g) || [];
        if (tokens.length > 0) {
          resultRows.push({
            subject: subj,
            rawLine: line,
            scores: tokens,
          });
          break;
        }
      }
    }
  }

  return resultRows;
}

/**
 * Replaces only the text runs <w:t> in a table cell XML while preserving all formatting.
 */
function replaceCellText(tcXml, newText) {
  if (/<w:t[\s\S]*?<\/w:t>/.test(tcXml)) {
    let replacedFirst = false;
    return tcXml.replace(/<w:t([^>]*)>([\s\S]*?)<\/w:t>/g, (match, attrs, content) => {
      if (!replacedFirst) {
        replacedFirst = true;
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
 * Main function: Injects extracted results into the Word document (.docx).
 * ONLY modifies the numerical scores / results in the table cells.
 * Leaves 100% of the document layout, logos, fonts, tables, and borders untouched.
 */
export async function injectResultsIntoDocx(targetDocxBuffer, sourceGrades = []) {
  const zip = await JSZip.loadAsync(targetDocxBuffer);
  const docPath = "word/document.xml";
  let docXml = await zip.file(docPath)?.async("text");

  if (!docXml) {
    throw new Error("Invalid Word Document: word/document.xml not found.");
  }

  // Find all tables in document
  const tblRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
  let tableUpdated = false;

  docXml = docXml.replace(tblRegex, (tblXml) => {
    // Only target table that contains 'Subjects' or has multiple rows with grades
    if (!tblXml.includes("Subject")) {
      return tblXml;
    }
    tableUpdated = true;

    const trRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
    const rows = tblXml.match(trRegex) || [];

    if (rows.length <= 2) return tblXml;

    // First 2 rows are headers
    const headerRows = rows.slice(0, 2);
    const dataRows = rows.slice(2);

    const updatedDataRows = dataRows.map((rowXml, rowIndex) => {
      const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
      const cells = rowXml.match(tcRegex) || [];

      if (cells.length === 0) return rowXml;

      // Extract subject name in first cell
      const subjTexts = (cells[0].match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map((t) =>
        t.replace(/<.*?>/g, "")
      );
      const rowSubject = subjTexts.join("").trim();
      const normTargetSubj = normalizeStr(rowSubject);

      // Find match in sourceGrades
      let matchedSource = sourceGrades.find(
        (sg) => normalizeStr(sg.subject) === normTargetSubj
      );

      // Fallback: match by row index if name not matched
      if (!matchedSource && sourceGrades[rowIndex]) {
        matchedSource = sourceGrades[rowIndex];
      }

      if (!matchedSource) {
        return rowXml; // Keep row untouched if no match
      }

      const sourceScores = matchedSource.scores || [];

      // Replace scores in cell 1 onwards
      let cellIndex = 0;
      const updatedRowXml = rowXml.replace(tcRegex, (tcXmlContent) => {
        if (cellIndex === 0) {
          // Cell 0 is the Subject Name - DO NOT MODIFY
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

      return updatedRowXml;
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
