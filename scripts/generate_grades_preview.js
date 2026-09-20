const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function processImage() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789931758035.jpg';
  
  // 1. QR Code
  const targetUrl = 'https://www.gyaschol.com/ref/1121890.png';
  const qrBuffer = await QRCode.toBuffer(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 96,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Precise replacement:
  // "Grade :  Abebe" -> we replace just the value part with " 9    " with underline
  // "Grade :  9" -> we replace just the value part with " 10   " with underline
  // In the original template:
  // "Grade : " is y: 228..248
  // Underline is at y: 244
  
  const grade9Svg = Buffer.from(
    `<svg width="90" height="18" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="90" height="18" fill="#ffffff" />` +
      `<line x1="0" y1="16" x2="88" y2="16" stroke="#000000" stroke-width="1.2" />` +
      `<text x="18" y="13" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="normal" fill="#000000">9</text>` +
    `</svg>`
  );

  const grade10Svg = Buffer.from(
    `<svg width="60" height="18" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="60" height="18" fill="#ffffff" />` +
      `<line x1="0" y1="16" x2="58" y2="16" stroke="#000000" stroke-width="1.2" />` +
      `<text x="14" y="13" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="normal" fill="#000000">10</text>` +
    `</svg>`
  );

  const compositeList = [
    {
      input: qrBuffer,
      left: 118,
      top: 80
    },
    {
      input: grade9Svg,
      left: 348,
      top: 229
    },
    {
      input: grade10Svg,
      left: 520,
      top: 229
    }
  ];

  const resultJpg = await sharp(uploadedPath)
    .composite(compositeList)
    .jpeg({ quality: 98 })
    .toBuffer();

  const previewPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/cristian_abebe_transcript_preview.jpg';
  fs.writeFileSync(previewPath, resultJpg);

  const publicPath = path.resolve('public');
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_preview.jpg'), resultJpg);

  console.log('Fine-tuned preview generated!');
}

processImage().catch(console.error);
