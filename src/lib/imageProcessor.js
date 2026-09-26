import sharp from "sharp";
import QRCode from "qrcode";
import jsQR from "jsqr";
import fs from "fs";
import path from "path";
import os from "os";
import {
  BinaryBitmap,
  HybridBinarizer,
  RGBLuminanceSource,
  QRCodeReader,
  DecodeHintType,
} from "@zxing/library";
import { saveTranscriptData } from "./serverStore";

/**
 * 1 & 2. Comprehensive QR Code Detector
 * Uses ZXing + jsQR to detect exact position (x, y, width, height) automatically
 */
export async function detectExactQrCode(imageBuffer) {
  const meta = await sharp(imageBuffer).metadata();
  const imgWidth = meta.width;
  const imgHeight = meta.height;

  // Attempt 1: ZXing Library
  try {
    const rawRgba = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer();

    const luminances = new Uint8ClampedArray(imgWidth * imgHeight);
    for (let i = 0; i < luminances.length; i++) {
      const r = rawRgba[i * 4];
      const g = rawRgba[i * 4 + 1];
      const b = rawRgba[i * 4 + 2];
      luminances[i] = (r * 306 + g * 601 + b * 117) >> 10;
    }

    const source = new RGBLuminanceSource(luminances, imgWidth, imgHeight);
    const bitmap = new BinaryBitmap(new HybridBinarizer(source));
    const reader = new QRCodeReader();
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);

    const result = reader.decode(bitmap, hints);
    if (result && result.getResultPoints() && result.getResultPoints().length >= 3) {
      const points = result.getResultPoints();
      const xs = points.map((p) => p.getX());
      const ys = points.map((p) => p.getY());

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const estimatedPatternWidth = (maxX - minX);
      const moduleEstimate = estimatedPatternWidth / 21;
      const pad = Math.round(moduleEstimate * 3.5);

      const boxLeft = Math.max(0, Math.round(minX - pad));
      const boxTop = Math.max(0, Math.round(minY - pad));
      const boxWidth = Math.min(imgWidth - boxLeft, Math.round(maxX - minX + pad * 2));
      const boxHeight = Math.min(imgHeight - boxTop, Math.round(maxY - minY + pad * 2));

      return {
        detected: true,
        detector: "zxing",
        left: boxLeft,
        top: boxTop,
        width: boxWidth,
        height: boxHeight,
        originalUrl: result.getText() || "",
      };
    }
  } catch (e) {
    // Fallback to jsQR
  }

  // Attempt 2: jsQR Library
  try {
    const rawRgba = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer();

    const qr = jsQR(new Uint8ClampedArray(rawRgba), imgWidth, imgHeight, {
      inversionAttempts: "attemptBoth",
    });

    if (qr && qr.location) {
      const loc = qr.location;
      const xs = [loc.topLeftCorner.x, loc.topRightCorner.x, loc.bottomLeftCorner.x, loc.bottomRightCorner.x];
      const ys = [loc.topLeftCorner.y, loc.topRightCorner.y, loc.bottomLeftCorner.y, loc.bottomRightCorner.y];

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      return {
        detected: true,
        detector: "jsqr",
        left: Math.round(minX),
        top: Math.round(minY),
        width: Math.round(maxX - minX),
        height: Math.round(maxY - minY),
        originalUrl: qr.data || "",
      };
    }
  } catch (e) {
    // Fallback
  }

  // Fallback: Default bounding box
  return {
    detected: false,
    detector: "proportional-fallback",
    left: Math.round(imgWidth * 0.05),
    top: Math.round(imgHeight * 0.81),
    width: Math.round(imgWidth * 0.12),
    height: Math.round(imgWidth * 0.12),
    originalUrl: "",
  };
}

/**
 * 3, 4, 5, 6. Surgical QR Code Replacer Pipeline
 */
export async function processSurgicalQrReplacement(imageBuffer, originalFilename = "transcript.jpg", customId = null, domainBaseUrl = null) {
  const meta = await sharp(imageBuffer).metadata();
  const imgWidth = meta.width;
  const imgHeight = meta.height;

  // 1. Detect exact location
  const detection = await detectExactQrCode(imageBuffer);
  const { left, top, width, height } = detection;

  // 2. Determine target URL & ID
  const id = customId ? String(customId).trim() : "1184229";
  const domain = domainBaseUrl ? domainBaseUrl.replace(/\/+$/, "") : "https://gs.gyaschol.com";
  const newQrUrl = `${domain}/ref/${id}.png`;

  // 3. Sample background paper texture right adjacent to the QR code
  let sampleLeft = Math.min(imgWidth - 30, left + width + 5);
  let sampleTop = top;
  let sampleWidth = Math.min(30, imgWidth - sampleLeft);
  let sampleHeight = Math.min(height, imgHeight - sampleTop);

  if (sampleWidth <= 0 || sampleLeft >= imgWidth) {
    sampleLeft = Math.max(0, left - 35);
    sampleWidth = 30;
  }

  const paperSampleBuffer = await sharp(imageBuffer)
    .extract({
      left: sampleLeft,
      top: sampleTop,
      width: sampleWidth,
      height: sampleHeight,
    })
    .resize(width, height, { fit: "fill" })
    .toBuffer();

  // 4. Generate clean new QR code with transparent background
  const qrSvg = await QRCode.toString(newQrUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    color: {
      dark: "#26282b",
      light: "#00000000",
    },
  });

  const qrOverlayPng = await sharp(Buffer.from(qrSvg))
    .resize(width, height)
    .png()
    .toBuffer();

  // 5. Surgical replacement:
  const finalUpdatedJpg = await sharp(imageBuffer)
    .composite([
      { input: paperSampleBuffer, left, top },
      { input: qrOverlayPng, left, top },
    ])
    .jpeg({ quality: 99 })
    .toBuffer();

  const finalUpdatedPng = await sharp(finalUpdatedJpg)
    .png()
    .toBuffer();

  // 6. Safe write to public/ref if in development / writable filesystem
  try {
    const publicPath = path.resolve("public");
    const refDir = path.join(publicPath, "ref");
    if (!fs.existsSync(refDir)) {
      fs.mkdirSync(refDir, { recursive: true });
    }
    fs.writeFileSync(path.join(refDir, `${id}.png`), finalUpdatedPng);
    fs.writeFileSync(path.join(refDir, `${id}.jpg`), finalUpdatedJpg);
    fs.writeFileSync(path.join(publicPath, "cristian_abebe_transcript_updated.jpg"), finalUpdatedJpg);
  } catch (fsErr) {
    // Gracefully handle read-only filesystem (EROFS) on Vercel Serverless
    console.warn("Public directory write skipped (serverless environment):", fsErr.message);
  }

  // 7. Persist to serverStore (in-memory + /tmp directory)
  await saveTranscriptData(id, {
    metadata: {
      originalFilename,
      id,
      newQrUrl,
      detection,
      savedAt: new Date().toISOString(),
    },
    photoBuffer: finalUpdatedJpg,
    photoBase64: finalUpdatedJpg.toString("base64"),
  });

  return {
    success: true,
    id,
    newQrUrl,
    detection,
    filename: `updated_${originalFilename.replace(/\.[^/.]+$/, "")}.png`,
    downloadUrl: `/ref/${id}.png`,
    updatedImageBase64: finalUpdatedJpg.toString("base64"),
  };
}
