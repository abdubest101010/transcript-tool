import JSZip from "jszip";

/**
 * Normalizes subject names for accurate matching across documents
 */
function normalizeSubject(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Extracts all text runs inside a cell XML (<w:tc>)
 */
function getCellText(tcXml) {
  const texts = (tcXml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || []).map((t) =>
    t.replace(/<.*?>/g, "")
  );
  return texts.join("").trim();
}

/**
 * Replaces the inner text of <w:t> in a cell XML while preserving all formatting, runs, and styles.
 */
function updateCellTextPreservingFormat(tcXml, newText) {
  if (/<w:t[^>]*>[\s\S]*?<\/w:t>/.test(tcXml)) {
    let replaced = false;
    return tcXml.replace(/<w:t([^>]*)>([\s\S]*?)<\/w:t>/g, (match, attrs, oldText) => {
      if (!replaced) {
        replaced = true;
        return `<w:t${attrs}>${newText}</w:t>`;
      }
      return `<w:t${attrs}></w:t>`;
    });
  }

  // If cell had no <w:t>, inject text run inside first paragraph
  if (/<w:p[\s\S]*?<\/w:p>/.test(tcXml)) {
    if (/<w:pPr[\s\S]*?<\/w:pPr>/.test(tcXml)) {
      return tcXml.replace(/(<w:pPr[\s\S]*?<\/w:pPr>)/, `$1<w:r><w:t>${newText}</w:t></w:r>`);
    }
    return tcXml.replace(/(<w:p[^>]*>)/, `$1<w:r><w:t>${newText}</w:t></w:r>`);
  }

  return tcXml;
}

/**
 * Finds the main results/grades table in a document XML
 */
function findGradesTable(docXml) {
  const tblRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
  const tables = docXml.match(tblRegex) || [];

  if (tables.length === 0) return null;

  // Find the table that contains "Subject" or has the largest number of rows
  let bestTable = tables.find((t) => t.includes("Subject") || t.includes("Grade"));
  if (!bestTable) {
    let maxRows = 0;
    tables.forEach((t) => {
      const rowCount = (t.match(/<w:tr[\s\S]*?<\/w:tr>/g) || []).length;
      if (rowCount > maxRows) {
        maxRows = rowCount;
        bestTable = t;
      }
    });
  }

  return bestTable || tables[0];
}

/**
 * Extracts structured subject results from a Source DOCX buffer
 */
export async function extractResultsFromSourceDocx(sourceBuffer) {
  const zip = await JSZip.loadAsync(sourceBuffer);
  const docXml = await zip.file("word/document.xml")?.async("text");

  if (!docXml) {
    throw new Error("Invalid Source DOCX: word/document.xml not found.");
  }

  const tableXml = findGradesTable(docXml);
  if (!tableXml) {
    throw new Error("Could not find results table in Source DOCX.");
  }

  const rows = tableXml.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
  const subjectsMap = new Map();
  const subjectsList = [];

  // Skip header rows (index 0 and index 1 if it's a 2-row header)
  let dataStartIndex = 1;
  if (rows.length > 2 && (rows[0].includes("Grade") || rows[1].includes("Sem") || rows[1].includes("1st"))) {
    dataStartIndex = 2;
  }

  for (let i = dataStartIndex; i < rows.length; i++) {
    const rowXml = rows[i];
    const cells = rowXml.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
    if (cells.length < 2) continue;

    const subjectName = getCellText(cells[0]);
    if (!subjectName) continue;

    const scores = cells.slice(1).map((c) => getCellText(c));

    const item = {
      subject: subjectName,
      normalized: normalizeSubject(subjectName),
      scores,
      rowIndex: i - dataStartIndex,
    };

    subjectsList.push(item);
    subjectsMap.set(item.normalized, item);
  }

  return { subjectsMap, subjectsList };
}

/**
 * Copies only the numerical results from Source DOCX into Target DOCX.
 * Preserves 100% of Target DOCX formatting, headers, photos, stamps, fonts, and styles.
 */
export async function copyResultsBetweenDocx(sourceBuffer, targetBuffer) {
  // 1. Extract results from Source
  const { subjectsMap, subjectsList } = await extractResultsFromSourceDocx(sourceBuffer);

  // 2. Open Target DOCX
  const zip = await JSZip.loadAsync(targetBuffer);
  const docPath = "word/document.xml";
  let docXml = await zip.file(docPath)?.async("text");

  if (!docXml) {
    throw new Error("Invalid Target DOCX: word/document.xml not found.");
  }

  // 3. Locate the target results table
  const tblRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
  let targetTableFound = false;

  docXml = docXml.replace(tblRegex, (tblXml) => {
    if (!tblXml.includes("Subject") && !tblXml.includes("Grade")) {
      return tblXml;
    }
    targetTableFound = true;

    const rows = tblXml.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
    if (rows.length <= 2) return tblXml;

    let dataStartIndex = 1;
    if (rows.length > 2 && (rows[0].includes("Grade") || rows[1].includes("Sem") || rows[1].includes("1st"))) {
      dataStartIndex = 2;
    }

    const headerRows = rows.slice(0, dataStartIndex);
    const dataRows = rows.slice(dataStartIndex);

    const updatedDataRows = dataRows.map((rowXml, dataRowIndex) => {
      const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
      const cells = rowXml.match(tcRegex) || [];
      if (cells.length < 2) return rowXml;

      const targetSubjectName = getCellText(cells[0]);
      const normTargetSubj = normalizeSubject(targetSubjectName);

      // Match by subject name, or fallback to row index
      let matchedSource = subjectsMap.get(normTargetSubj);
      if (!matchedSource && subjectsList[dataRowIndex]) {
        matchedSource = subjectsList[dataRowIndex];
      }

      if (!matchedSource || !matchedSource.scores) {
        return rowXml; // Leave row completely unchanged if no match
      }

      const sourceScores = matchedSource.scores;

      // Replace scores in cell 1 onwards
      let cellCounter = 0;
      return rowXml.replace(tcRegex, (tcContent) => {
        if (cellCounter === 0) {
          // Cell 0 is Subject Name - DO NOT MODIFY
          cellCounter++;
          return tcContent;
        }

        const scoreIdx = cellCounter - 1;
        cellCounter++;

        if (scoreIdx < sourceScores.length) {
          const newScoreVal = sourceScores[scoreIdx];
          // Overwrite only the text value inside <w:t>, keeping all cell formatting intact
          return updateCellTextPreservingFormat(tcContent, newScoreVal);
        }

        return tcContent;
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
