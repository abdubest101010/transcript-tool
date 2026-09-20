const sharp = require('sharp');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function renderExactPhoto() {
  const uploadedPath = 'C:/Users/HP/.gemini/antigravity/brain/f166e2b1-7f86-4e70-8eb8-b563bbfcb585/.user_uploaded/media_1789939226714.jpg';
  const targetUrl = 'https://www.gyaschol.com/ref/1184229.jpg';
  
  // Clean solid white patch to ensure QR is crisp and has zero overlap
  const whitePatch = Buffer.from(
    `<svg width="125" height="125" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="125" height="125" fill="#ffffff" />` +
    `</svg>`
  );

  // Generate crisp QR code
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
    .jpeg({ quality: 99 })
    .toBuffer();

  const publicPath = path.resolve('public');
  const refDir = path.join(publicPath, 'ref');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  // Write both .jpg and .png for route 1184229
  fs.writeFileSync(path.join(refDir, '1184229.jpg'), resultJpg);
  fs.writeFileSync(path.join(publicPath, 'cristian_abebe_transcript_updated.jpg'), resultJpg);

  const resultPng = await sharp(resultJpg).png().toBuffer();
  fs.writeFileSync(path.join(refDir, '1184229.png'), resultPng);

  console.log('Saved exact attached photo to /ref/1184229.jpg and /ref/1184229.png');
}

renderExactPhoto().catch(console.error);
