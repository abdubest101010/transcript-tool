import sharp from "sharp";
import QRCode from "qrcode";
import jsQR from "jsqr";
import fs from "fs";
import path from "path";
import os from "os";
import { saveTranscriptData } from "./serverStore";

/**
 * Automatically detects QR code location on an image,
 * or defaults to the standard transcript QR location.
 */
async function detectQrBoundingBox(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const qr = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    if (qr && qr.location) {
      const minX = Math.min(
        qr.location.topLeftCorner.x,
        qr.location.bottomLeftCorner.x,
        qr.location.topRightCorner.x,
        qr.location.bottomRightCorner.x
      );
      const maxX = Math.max(
        qr.location.topLeftCorner.x,
        qr.location.bottomLeftCorner.x,
        qr.location.topRightCorner.x,
        qr.location.bottomRightCorner.x
      );
      const minY = Math.min(
        qr.location.topLeftCorner.y,
        qr.location.bottomLeftCorner.y,
        qr.location.topRightCorner.y,
        qr.location.bottomRightCorner.y
      );
      const maxY = Math.max(
        qr.location.topLeftCorner.y,
        qr.location.bottomLeftCorner.y,
        qr.location.topRightCorner.y,
        qr.location.bottomRightCorner.y
      );

      return {
        detected: true,
        left: Math.round(minX),
        top: Math.round(minY),
        width: Math.round(maxX - minX),
        height: Math.round(maxY - minY),
        data: qr.data || "",
      };
    }
  } catch (err) {
    console.warn("jsQR scan error:", err.message);
  }

  // Default proportional coordinates for 1024x676 or similar transcript images
  return {
    detected: false,
    left: 114,
    top: 92,
    width: 100,
    height: 100,
    data: "",
  };
}

/**
 * Process a transcript image:
 * 1. Generates or receives reference ID
 * 2. Generates clean QR code pointing to https://www.gyaschol.com/ref/[id].png
 * 3. Cleans previous QR area with a solid white background (preventing any overlap)
 * 4. Composites the new QR code onto the image
 * 5. Saves to storage & public routes
 */
export async function processTranscriptImage(imageBuffer, originalFilename = "transcript.jpg", customId = null, domainBaseUrl = null) {
  // 1. Generate unique 7-digit ID or use custom ID
  const id = customId ? String(customId).trim() : String(Math.floor(1000000 + Math.random() * 9000000));
  
  // 2. Determine target URL
  const domain = domainBaseUrl ? domainBaseUrl.replace(/\/+$/, "") : "https://www.gyaschol.com";
  const newQrUrl = `${domain}/ref/${id}.png`;

  // 3. Detect QR code or bounding box
  const qrBox = await detectQrBoundingBox(imageBuffer);
  
  const meta = await sharp(imageBuffer).metadata();
  const imgWidth = meta.width || 1024;
  const imgHeight = meta.height || 676;

  // Scale QR box if needed
  let patchLeft = qrBox.left;
  let patchTop = qrBox.top;
  let patchWidth = qrBox.width;
  let patchHeight = qrBox.height;

  // Add a slight margin to fully wipe out any ghost artifacts or overlapping previous QR lines
  const margin = 12;
  const cleanLeft = Math.max(0, patchLeft - margin);
  const cleanTop = Math.max(0, patchTop - margin);
  const cleanWidth = patchWidth + margin * 2;
  const cleanHeight = patchHeight + margin * 2;

  // Generate crisp QR code buffer
  const qrSize = Math.max(80, Math.min(patchWidth, patchHeight));
  const qrBuffer = await QRCode.toBuffer(newQrUrl, {
    errorCorrectionLevel: "H",
    margin: 0,
    width: qrSize,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  // Solid white patch SVG to clear the old QR cleanly
  const whitePatchSvg = Buffer.from(
    `<svg width="${cleanWidth}" height="${cleanHeight}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${cleanWidth}" height="${cleanHeight}" fill="#ffffff" />` +
    `</svg>`
  );

  const compositeOperations = [
    {
      input: whitePatchSvg,
      left: cleanLeft,
      top: cleanTop,
    },
    {
      input: qrBuffer,
      left: patchLeft,
      top: patchTop,
    },
  ];

  // Produce high-quality JPEG and PNG buffers
  const updatedJpgBuffer = await sharp(imageBuffer)
    .composite(compositeOperations)
    .jpeg({ quality: 98 })
    .toBuffer();

  const updatedPngBuffer = await sharp(updatedJpgBuffer)
    .png()
    .toBuffer();

  // Save to public/ref directory if available on local disk
  try {
    const publicRefDir = path.join(process.cwd(), "public", "ref");
    if (!fs.existsSync(publicRefDir)) {
      fs.mkdirSync(publicRefDir, { recursive: true });
    }
    fs.writeFileSync(path.join(publicRefDir, `${id}.jpg`), updatedJpgBuffer);
    fs.writeFileSync(path.join(publicRefDir, `${id}.png`), updatedPngBuffer);
  } catch (err) {
    console.warn("Could not write to public/ref:", err.message);
  }

  // Save to persistent server store (for serverless environments)
  await saveTranscriptData(id, {
    metadata: {
      originalFilename,
      id,
      newQrUrl,
      originalQrData: qrBox.data,
      savedAt: new Date().toISOString(),
    },
    photoBuffer: updatedJpgBuffer,
    photoBase64: updatedJpgBuffer.toString("base64"),
  });

  return {
    id,
    newQrUrl,
    originalQrData: qrBox.data,
    updatedJpgBuffer,
    updatedPngBuffer,
    updatedImageBase64: updatedJpgBuffer.toString("base64"),
    filename: `updated_${originalFilename.replace(/\.[^/.]+$/, "")}.jpg`,
  };
}
