import fs from "fs";
import path from "path";
import JSZip from "jszip";
import sharp from "sharp";

async function processOriginalDocx() {
  const originalDocxPath = path.join(process.cwd(), "scripts", "Frtuna Transcript-1.docx");
  const newPhotoPath = "C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789879908900.jpg";

  if (!fs.existsSync(originalDocxPath)) {
    throw new Error("Original docx not found at: " + originalDocxPath);
  }

  const docxBuf = fs.readFileSync(originalDocxPath);
  const zip = await JSZip.loadAsync(docxBuf);

  // Extract base page image
  const baseImgBuf = await zip.file("word/media/image1.jpeg").async("nodebuffer");
  const baseMeta = await sharp(baseImgBuf).metadata();
  const W = baseMeta.width; // 2338
  const H = baseMeta.height; // 1654

  // Prepare the student portrait photo
  // Photo box is located at bottom right: x: ~1650 to 1890, y: ~1185 to 1485 (width ~240, height ~300)
  // Let's crop/resize new photo to fit the photo box: 240 x 300
  const photoW = 245;
  const photoH = 300;
  const photoLeft = 1640;
  const photoTop = 1180;

  const photoBuf = fs.readFileSync(newPhotoPath);
  const processedPhoto = await sharp(photoBuf)
    .resize(photoW, photoH, { fit: "cover", position: "center" })
    .toBuffer();

  // Create SVG overlays for text, watermark, and blanking areas
  // 1. Blank out old short name under QR (around x: 250-460, y: 388-420) and draw "Christan A"
  // 2. Blank out old student name in "Name of the student:" (around x: 375-780, y: 442-480) and draw "Christian Abebe"
  // 3. Add top and bottom watermarks "UNOFFICIAL DRAFT — NOT AN OFFICIAL DOCUMENT"
  // 4. Add diagonal draft watermark

  const svgOverlay = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Blank out old short name under QR -->
    <rect x="235" y="388" width="230" height="32" fill="#ffffff" />
    <text x="350" y="412" font-family="'Times New Roman', serif" font-size="22" font-weight="bold" fill="#000000" text-anchor="middle">Christan A</text>

    <!-- Blank out old student name in Name of the Student -->
    <rect x="375" y="443" width="415" height="36" fill="#ffffff" />
    <text x="380" y="468" font-family="'Times New Roman', serif" font-size="24" font-weight="bold" fill="#000000" text-anchor="start">Christian Abebe</text>

    <!-- Top Watermark Header -->
    <rect x="0" y="0" width="${W}" height="45" fill="rgba(220, 38, 38, 0.9)" />
    <text x="${W / 2}" y="32" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="3">
      UNOFFICIAL DRAFT — NOT AN OFFICIAL DOCUMENT
    </text>

    <!-- Bottom Watermark Banner -->
    <rect x="0" y="${H - 45}" width="${W}" height="45" fill="rgba(220, 38, 38, 0.9)" />
    <text x="${W / 2}" y="${H - 15}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">
      UNOFFICIAL DRAFT — NOT AN OFFICIAL DOCUMENT — FOR PREVIEW ONLY
    </text>

    <!-- Subtle Diagonal Watermark -->
    <g transform="translate(${W / 2}, ${H / 2}) rotate(-30)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="90" font-weight="bold" fill="rgba(200, 0, 0, 0.08)" text-anchor="middle" letter-spacing="10">
        UNOFFICIAL DRAFT
      </text>
    </g>
  </svg>`;

  const svgBuf = Buffer.from(svgOverlay);

  // Composite photo and SVG onto base image
  const compositedImg = await sharp(baseImgBuf)
    .composite([
      { input: processedPhoto, left: photoLeft, top: photoTop },
      { input: svgBuf, left: 0, top: 0 },
    ])
    .jpeg({ quality: 96 })
    .toBuffer();

  // Replace image1.jpeg inside original DOCX
  zip.file("word/media/image1.jpeg", compositedImg);

  const updatedDocxBuf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  const outputPath = path.join(process.cwd(), "public", "Christian_Abebe_Draft_Transcript.docx");
  fs.writeFileSync(outputPath, updatedDocxBuf);

  // Also save a preview image for instant viewing
  const previewImgPath = path.join(process.cwd(), "public", "Christian_Abebe_Draft_Preview.jpg");
  fs.writeFileSync(previewImgPath, compositedImg);

  console.log("Successfully generated:", outputPath);
  console.log("Preview saved to:", previewImgPath);
}

processOriginalDocx().catch((err) => {
  console.error("Error processing original docx:", err);
  process.exit(1);
});
