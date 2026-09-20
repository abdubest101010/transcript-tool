const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function fixQrOverlap() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789933080727.jpg';
  const targetUrl = 'https://www.gyaschol.com/ref/1184229.png';
  
  // Clean white solid patch that completely clears any traces of old/overlapping QR codes
  // QR code box is located in x: 105..225, y: 80..200
  const whitePatch = Buffer.from(
    `<svg width="125" height="125" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="125" height="125" fill="#ffffff" />` +
    `</svg>`
  );

  // Generate crisp, clean QR code with margin: 0
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 0,
    width: 102,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const compositeList = [
    {
      input: whitePatch,
      left: 105,
      top: 85
    },
    {
      input: qrBuffer,
      left: 116,
      top: 93
    }
  ];

  const resultJpg = await sharp(uploadedPath)
    .composite(compositeList)
    .jpeg({ quality: 98 })
    .toBuffer();

  const previewPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/clean_qr_preview.jpg';
  fs.writeFileSync(previewPath, resultJpg);

  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), resultJpg);
  fs.writeFileSync(path.join(refDir, '1184229.jpg'), resultJpg);

  const resultPng = await sharp(resultJpg).png().toBuffer();
  fs.writeFileSync(path.join(refDir, '1184229.png'), resultPng);

  console.log('Fixed QR overlap and saved clean files!');
}

fixQrOverlap().catch(console.error);
