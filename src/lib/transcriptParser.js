import JSZip from "jszip";

/**
 * Parses a DOCX arrayBuffer and extracts transcript metadata, images, and grades table.
 */
export function getDefaultTranscriptData() {
  return {
    qrCodeDataUrl: null,
    bannerDataUrl: "/gibson_banner.png",
    photoDataUrl: null,
    photoBlobUrl: null,
    studentId: "1121564",
    studentName: "Inas Zakir Ahmed",
    studentShortName: "Inas Z",
    age: "17",
    gender: "Female",
    stream: "Natural Science",
    years: {
      g9: "2022/2023",
      g10: "2023/2024",
      g11: "2024/2025",
      g12: "2025/2026",
    },
    gradeRows: [
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
    ],
  };
}

/**
 * Parses a DOCX arrayBuffer and extracts transcript metadata, images, and grades table.
 */
export async function parseDocxTranscript(arrayBuffer) {
  if (!arrayBuffer) {
    return getDefaultTranscriptData();
  }

  try {
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Extract images
    let qrCodeDataUrl = null;
    let bannerDataUrl = null;
    let photoDataUrl = null;

    const qrFile = zip.file("word/media/image2.png");
    if (qrFile) {
      const b64 = await qrFile.async("base64");
      qrCodeDataUrl = `data:image/png;base64,${b64}`;
    }

    const bannerFile = zip.file("word/media/image1.jpg") || zip.file("word/media/image1.png");
    if (bannerFile) {
      const b64 = await bannerFile.async("base64");
      const mime = bannerFile.name.endsWith(".png") ? "image/png" : "image/jpeg";
      bannerDataUrl = `data:${mime};base64,${b64}`;
    }

    const photoFile =
      zip.file("word/media/image_photo.jpg") ||
      zip.file("word/media/image_photo.png") ||
      zip.file("word/media/image3.jpg") ||
      zip.file("word/media/image3.png");
    if (photoFile) {
      const b64 = await photoFile.async("base64");
      const mime = photoFile.name.endsWith(".png") ? "image/png" : "image/jpeg";
      photoDataUrl = `data:${mime};base64,${b64}`;
    }

    // Parse document XML
    const docXml = (await zip.file("word/document.xml")?.async("text")) || "";

    // 1. Extract Student Info
    let studentId = "1121564";
    let studentName = "Inas Zakir Ahmed";
    let studentShortName = "Inas Z";
    let age = "17";
    let gender = "Female";
    let stream = "Natural Science";

    // Extract Student ID
    const studentIdMatch = docXml.match(/Student\s*ID:[\s\S]*?(\d+)/i) || docXml.match(/ID:[\s\S]*?(\d{5,10})/i);
    if (studentIdMatch && studentIdMatch[1]) {
      studentId = studentIdMatch[1].trim();
    }

    // Look for "Name of the student:" paragraph
    const studentInfoMatch = docXml.match(/Name of the [Ss]tudent:[\s\S]*?Stream:[\s\S]*?<\/w:p>/);
    if (studentInfoMatch) {
      const rawText = studentInfoMatch[0].replace(/<.*?>/g, " ").replace(/\s+/g, " ");
      const nameM = rawText.match(/Name of the [Ss]tudent:\s*(.*?)\s*Age:/i);
      const ageM = rawText.match(/Age:\s*(\d+)/i);
      const genderM = rawText.match(/Gender:\s*(.*?)\s*Stream:/i);
      const streamM = rawText.match(/Stream:\s*(.*?)$/i);

      if (nameM && nameM[1].trim()) studentName = nameM[1].trim();
      if (ageM && ageM[1].trim()) age = ageM[1].trim();
      if (genderM && genderM[1].trim()) gender = genderM[1].trim();
      if (streamM && streamM[1].trim()) stream = streamM[1].trim();
    }

    // Look for short name under QR
    const shortNameMatch =
      docXml.match(/<w:t[^>]*>([A-Za-z]+(?:\s*\.\s*[A-Za-z]|\s+[A-Za-z]))<\/w:t>/i) ||
      docXml.match(/<w:t[^>]*>(Chrstian[\s\S]*?|Inas[\s\S]*?)<\/w:t>/i);
    if (shortNameMatch) {
      const cleaned = shortNameMatch[1].replace(/<.*?>/g, "").trim();
      if (cleaned && cleaned.length < 25 && !cleaned.includes("Student") && !cleaned.includes("Gibson")) {
        studentShortName = cleaned;
      }
    } else if (studentName) {
      const parts = studentName.trim().split(/\s+/);
      if (parts.length >= 2) {
        studentShortName = `${parts[0]} ${parts[parts.length - 1][0]}`;
      } else {
        studentShortName = studentName;
      }
    }

    // 2. Extract Academic Years
    let grade9Year = "2022/2023";
    let grade10Year = "2023/2024";
    let grade11Year = "2024/2025";
    let grade12Year = "2025/2026";

    const g9Match = docXml.match(/Grade:\s*9[\s\S]*?Aca\.?\s*Year:?\s*([^\s<]+)/i);
    if (g9Match) grade9Year = g9Match[1];
    const g10Match = docXml.match(/Grade:\s*10[\s\S]*?Aca\.?\s*Year:?\s*([^\s<]+)/i);
    if (g10Match) grade10Year = g10Match[1];
    const g11Match = docXml.match(/Grade:\s*11[\s\S]*?Aca\.?\s*Year:?\s*([^\s<]+)/i);
    if (g11Match) grade11Year = g11Match[1];
    const g12Match = docXml.match(/Grade:\s*12[\s\S]*?Aca\.?\s*Year:?\s*([^\s<]+)/i);
    if (g12Match) grade12Year = g12Match[1];

    // 3. Extract Grade Table Rows
    const tableRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
    const tables = docXml.match(tableRegex) || [];
    const gradeTableXml = tables.find((t) => t.includes("Subjects"));

    let gradeRows = [];
    if (gradeTableXml) {
      const rowRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
      const rows = gradeTableXml.match(rowRegex) || [];

      // Skip header rows (index 0 and 1)
      const dataRows = rows.slice(2);
      gradeRows = dataRows.map((r) => {
        const cellRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
        const cells = r.match(cellRegex) || [];
        const cellTexts = cells.map((c) => {
          const texts = (c.match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map((t) =>
            t.replace(/<.*?>/g, "")
          );
          return texts.join("").trim();
        });

        const subject = cellTexts[0] || "";
        // The remaining 12 cells represent: G9(3), G10(3), G11(3), G12(3)
        const scores = cellTexts.slice(1);
        while (scores.length < 12) {
          scores.push("");
        }

        return {
          subject,
          g9: [scores[0] || "", scores[1] || "", scores[2] || ""],
          g10: [scores[3] || "", scores[4] || "", scores[5] || ""],
          g11: [scores[6] || "", scores[7] || "", scores[8] || ""],
          g12: [scores[9] || "", scores[10] || "", scores[11] || ""],
        };
      });
    }

    if (gradeRows.length === 0) {
      gradeRows = getDefaultTranscriptData().gradeRows;
    }

    return {
      qrCodeDataUrl,
      bannerDataUrl: bannerDataUrl || "/gibson_banner.png",
      photoDataUrl,
      studentId,
      studentName,
      studentShortName,
      age,
      gender,
      stream,
      years: {
        g9: grade9Year,
        g10: grade10Year,
        g11: grade11Year,
        g12: grade12Year,
      },
      gradeRows,
    };
  } catch (err) {
    console.warn("Error parsing docx transcript, using fallback:", err);
    return getDefaultTranscriptData();
  }
}
