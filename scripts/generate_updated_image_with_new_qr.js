import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import sharp from "sharp";
import { saveTranscriptData } from "../src/lib/serverStore.js";

async function processImage() {
  const inputImgPath = "C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789927826450.jpg";
  const imgBuf = fs.readFileSync(inputImgPath);

  const newId = "1121890";
  const newQrUrl = `https://www.gyaschol.com/ref/${newId}.png`;

  console.log("Generating new QR code pointing to:", newQrUrl);

  // Exact QR coordinates detected from image (width 1024 x 676):
  // left: 114, top: 70, width: 93, height: 80
  const qrLeft = 114;
  const qrTop = 69;
  const qrWidth = 93;
  const qrHeight = 80;

  // Generate crisp QR code buffer
  const qrPng = await QRCode.toBuffer(newQrUrl, {
    type: "png",
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  const resizedQr = await sharp(qrPng)
    .resize(qrWidth, qrHeight, { fit: "fill" })
    .toBuffer();

  // Composite the new QR onto the base image
  const compositedImage = await sharp(imgBuf)
    .composite([
      { input: resizedQr, left: qrLeft, top: qrTop }
    ])
    .jpeg({ quality: 98 })
    .toBuffer();

  // Ensure public/ref directories exist
  const refDir = path.join(process.cwd(), "public", "ref");
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  // Save outputs
  const outJpg = path.join(process.cwd(), "public", "cristian_abebe_transcript_updated.jpg");
  const outPng1 = path.join(refDir, `${newId}.png`);
  const outJpg1 = path.join(refDir, `${newId}.jpg`);
  const outPng2 = path.join(refDir, "1121564.png");
  const outJpg2 = path.join(refDir, "1121564.jpg");

  fs.writeFileSync(outJpg, compositedImage);
  fs.writeFileSync(outPng1, compositedImage);
  fs.writeFileSync(outJpg1, compositedImage);
  fs.writeFileSync(outPng2, compositedImage);
  fs.writeFileSync(outJpg2, compositedImage);

  // Save to server store as well
  await saveTranscriptData(newId, {
    metadata: {
      id: newId,
      newQrUrl,
      originalQrData: "gs.gyaschool.com/ref/1121564.png",
      processedAt: new Date().toISOString(),
    },
    photoBuffer: compositedImage,
  });

  await saveTranscriptData("1121564", {
    metadata: {
      id: "1121564",
      newQrUrl,
      originalQrData: "gs.gyaschool.com/ref/1121564.png",
      processedAt: new Date().toISOString(),
    },
    photoBuffer: compositedImage,
  });

  console.log("Successfully generated and saved updated transcript image!");
  console.log("File saved to:", outJpg);
}

processImage().catch(err => console.error("Error:", err));
