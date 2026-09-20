import fs from "fs";
import path from "path";
import JSZip from "jszip";
import QRCode from "qrcode";
import sharp from "sharp";
import { saveTranscriptData } from "../src/lib/serverStore.js";

async function generateChristianTranscript() {
  const photoPath = "C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789878268031.jpg";
  const photoBuffer = fs.readFileSync(photoPath);

  // Resize student photo
  const processedPhoto = await sharp(photoBuffer)
    .resize(300, 360, { fit: "cover", position: "center" })
    .jpeg({ quality: 95 })
    .toBuffer();

  const id = "ChristianA";
  const qrUrl = `https://transcript-tool-liart.vercel.app/t/${id}`;

  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    type: "png",
    width: 600,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });

  // Read banner image from public folder if exists
  let bannerBuffer = null;
  const bannerPath = path.join(process.cwd(), "public", "gibson_banner.png");
  if (fs.existsSync(bannerPath)) {
    bannerBuffer = fs.readFileSync(bannerPath);
  } else {
    // Generate simple placeholder or empty
    bannerBuffer = qrBuffer;
  }

  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

  // 2. _rels/.rels
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

  // 3. word/_rels/document.xml.rels
  zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image2.png"/>
  <Relationship Id="rIdPhoto" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image_photo.jpg"/>
</Relationships>`);

  // 4. word/media images
  zip.file("word/media/image1.png", bannerBuffer);
  zip.file("word/media/image2.png", qrBuffer);
  zip.file("word/media/image_photo.jpg", processedPhoto);

  const gradeRowsData = [
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

  function buildTableRowsXml() {
    return gradeRowsData
      .map((r) => {
        const scores = [...r.g9, ...r.g10, ...r.g11, ...r.g12];
        const cellsXml = scores
          .map(
            (s) =>
              `<w:tc><w:tcPr><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/></w:rPr><w:t>${s}</w:t></w:r></w:p></w:tc>`
          )
          .join("");

        return `<w:tr><w:tc><w:tcPr><w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/></w:tcBorders></w:tcPr><w:p><w:pPr><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/></w:rPr><w:t>${r.subject}</w:t></w:r></w:p></w:tc>${cellsXml}</w:tr>`;
      })
      .join("");
  }

  // 5. word/document.xml
  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <!-- Top Header Table with QR and Banner -->
    <w:tbl>
      <w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:none/></w:tblBorders></w:tblPr>
      <w:tr>
        <w:tc>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="850000" cy="850000"/><wp:docPr id="1" name="QR Code"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="image2.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId2"/></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="850000" cy="850000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>
          </w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Christan A</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Gibson School Systems</w:t></w:r></w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="18"/></w:rPr><w:t>Gibson Youth Academy and Gibson Preparatory College</w:t></w:r></w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>Making Young People Stronger</w:t></w:r></w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="14"/></w:rPr><w:t>Central Administrative Office, Phone: 011-662-8312 or 011-661-0150</w:t></w:r></w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="14"/></w:rPr><w:t>P.O. Box 13564 Addis Ababa, Ethiopia, https://goschool.com, info@goschool.com</w:t></w:r></w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:u w:val="single"/><w:sz w:val="22"/></w:rPr><w:t>Student Transcript</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- Student Details -->
    <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Name of the Student: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Christian Abebe     </w:t></w:r><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Age: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>17     </w:t></w:r><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Gender: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Male     </w:t></w:r><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Stream: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Natural Science</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Student ID: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>1121564</w:t></w:r></w:p>

    <!-- Grades Table -->
    <w:tbl>
      <w:tblPr><w:tblW w:w="0" w:type="auto"/></w:tblPr>
      <!-- Header Row 1 -->
      <w:tr>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Subjects</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>Grade: 9 (2022/2023)</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>Grade: 10 (2023/2024)</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>Grade: 11 (2024/2025)</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="16"/></w:rPr><w:t>Grade: 12 (2025/2026)</w:t></w:r></w:p></w:tc>
      </w:tr>
      <!-- Data Rows -->
      ${buildTableRowsXml()}
    </w:tbl>

    <!-- Photo and Signature Table at Bottom -->
    <w:tbl>
      <w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:none/></w:tblBorders></w:tblPr>
      <w:tr>
        <w:tc>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Record Keeper's Name: Selamawit Chernet</w:t></w:r></w:p>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Signature: [Signed]        Date: August 8, 2026</w:t></w:r></w:p>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Site Director Name: Assega Lemma</w:t></w:r></w:p>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>Signature: [Signed]        Date: August 08, 2026</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="1069354" cy="1283225"/><wp:docPr id="99" name="Student Photo"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="99" name="image_photo.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdPhoto"/></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1069354" cy="1283225"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>
          </w:p>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="14"/></w:rPr><w:t>Note: The photo is valid only when stamped and scanned.</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>
  </w:body>
</w:document>`;

  zip.file("word/document.xml", docXml);

  const docxBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  const outPath = path.join(process.cwd(), "public", "Christian_Abebe_Transcript.docx");
  fs.writeFileSync(outPath, docxBuffer);
  console.log("Created:", outPath);

  // Also save to server store so scanning QR or navigating to /t/ChristianA works directly!
  const parsedData = {
    qrCodeDataUrl: `data:image/png;base64,${qrBuffer.toString("base64")}`,
    bannerDataUrl: "/gibson_banner.png",
    photoDataUrl: `data:image/jpeg;base64,${processedPhoto.toString("base64")}`,
    studentId: "1121564",
    studentName: "Christian Abebe",
    studentShortName: "Christan A",
    age: "17",
    gender: "Male",
    stream: "Natural Science",
    years: {
      g9: "2022/2023",
      g10: "2023/2024",
      g11: "2024/2025",
      g12: "2025/2026",
    },
    gradeRows: gradeRowsData,
  };

  await saveTranscriptData(id, {
    metadata: {
      id,
      originalFilename: "Christian_Abebe_Transcript.docx",
      originalQrData: "https://transcript-tool-liart.vercel.app/t/ChristianA",
      newQrUrl: qrUrl,
      processedAt: new Date().toISOString(),
      hasPhoto: true,
    },
    parsedData,
    modifiedDocxBuffer: docxBuffer,
    photoBuffer: processedPhoto,
  });

  console.log("Saved to serverStore ID:", id);
}

generateChristianTranscript();
