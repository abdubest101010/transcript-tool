const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processBothTranscripts() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1790274806084.jpg';
  const targetUrl = 'https://gs.gyaschol.com/ref/1184229.png';

  // 1. Generate Clean QR Code for targetUrl
  // In portrait (724 x 1024):
  // QR is at: left: 34, top: 828, width: 85, height: 85
  const qrWidth = 85;
  const qrHeight = 85;
  const qrLeft = 34;
  const qrTop = 828;

  // Solid clean patch to wipe 100% of the old QR code
  const cleanPatchPortrait = Buffer.from(
    `<svg width="${qrWidth + 4}" height="${qrHeight + 4}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${qrWidth + 4}" height="${qrHeight + 4}" fill="#ffffff" />` +
    `</svg>`
  );

  const qrBufferPortrait = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 0,
    width: qrWidth,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Generate the unrotated (original orientation) image with clean QR
  const portraitResultBuffer = await sharp(uploadedPath)
    .composite([
      { input: cleanPatchPortrait, left: qrLeft - 2, top: qrTop - 2 },
      { input: qrBufferPortrait, left: qrLeft, top: qrTop }
    ])
    .jpeg({ quality: 99 })
    .toBuffer();

  // 2. Generate the rotated (upright, readable landscape) image
  // In rot90 (1024 x 724):
  // When rotated 90 degrees clockwise:
  // new_x = 1024 - (old_y + old_height) = 1024 - (828 + 85) = 111
  // new_y = old_x = 34
  // Let's create high quality rotated version from the raw image and composite clean QR
  const rot90Raw = await sharp(uploadedPath).rotate(90).toBuffer();
  
  const rotQrLeft = 111;
  const rotQrTop = 34;

  const cleanPatchRotated = Buffer.from(
    `<svg width="${qrWidth + 4}" height="${qrHeight + 4}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${qrWidth + 4}" height="${qrHeight + 4}" fill="#ffffff" />` +
    `</svg>`
  );

  const qrBufferRotated = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 0,
    width: qrWidth,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const rotatedResultBuffer = await sharp(rot90Raw)
    .composite([
      { input: cleanPatchRotated, left: rotQrLeft - 2, top: rotQrTop - 2 },
      { input: qrBufferRotated, left: rotQrLeft, top: rotQrTop }
    ])
    .jpeg({ quality: 99 })
    .toBuffer();

  const rotatedPngBuffer = await sharp(rotatedResultBuffer)
    .png()
    .toBuffer();

  // 3. Save files to public/ref and artifact directories
  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  // The live route /ref/1184229.png and .jpg will serve the rotated (clean, upright readable) transcript
  fs.writeFileSync(path.join(refDir, '1184229.png'), rotatedPngBuffer);
  fs.writeFileSync(path.join(refDir, '1184229.jpg'), rotatedResultBuffer);
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), rotatedResultBuffer);

  // Save specific downloadable versions:
  // (A) Before rotate (original orientation)
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_before_rotate.jpg'), portraitResultBuffer);
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/cristian_abebe_transcript_before_rotate.jpg', portraitResultBuffer);

  // (B) After rotate (upright, readable orientation)
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_after_rotate.jpg'), rotatedResultBuffer);
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/cristian_abebe_transcript_after_rotate.jpg', rotatedResultBuffer);

  console.log('Successfully generated both unrotated and rotated images without any overlap!');
}

processBothTranscripts().catch(console.error);
